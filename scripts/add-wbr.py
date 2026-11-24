"""日本語の本文に、文節の切れ目だけで改行できるよう <wbr> を入れる。

ページ側は word-break: keep-all なので、<wbr> の無いところでは折り返さない。
文言を変えたら、このスクリプトを流し直す（何度流しても結果は同じ）。

    pip install budoux
    python3 scripts/add-wbr.py index.html
"""
import re
import sys

import budoux

JA = re.compile(r'[぀-ヿ㐀-鿿！-｠]')
TOKEN = re.compile(r'(<!--.*?-->|<[^>]+>)', re.S)
# 中身を書き換えない要素。data-typed は JS が 1 文字ずつ出すので触らない。
# .nw は「ここでは折り返さない」と手で決めた箇所（<wbr> があると Chrome は nowrap でも折る）
SKIP_OPEN = re.compile(r'<(script|style|svg|title)\b|<span\b[^>]*(?:\bdata-typed\b|class="nw")', re.I)


def main(path):
    parser = budoux.load_default_japanese_parser()
    src = open(path, encoding='utf-8').read()
    head, sep, body = src.partition('<body')
    if not sep:
        sys.exit('no <body>')
    # 入れ直しで結果が変わらないよう、いったん全部外してから区切り直す
    body = body.replace('<wbr>', '')
    out, skip_tag = [], None
    for part in TOKEN.split(body):
        if not part:
            continue
        if part.startswith('<'):
            out.append(part)
            if skip_tag:
                if re.match(r'</%s\b' % skip_tag, part, re.I):
                    skip_tag = None
            else:
                m = SKIP_OPEN.match(part)
                if m:
                    skip_tag = m.group(1) or 'span'
            continue
        if skip_tag or not JA.search(part):
            out.append(part)
            continue
        # 前後の空白・改行は保ったまま、中身だけ区切る
        lead = part[:len(part) - len(part.lstrip())]
        trail = part[len(part.rstrip()):]
        core = part.strip()
        out.append(lead + '<wbr>'.join(parser.parse(core)) + trail)
    body = ''.join(out)
    open(path, 'w', encoding='utf-8').write(head + sep + body)


if __name__ == '__main__':
    for p in sys.argv[1:]:
        main(p)
