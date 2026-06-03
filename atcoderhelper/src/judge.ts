
export function normalize(
    str: string
) {

    return str

    .replace(/\r/g,'')

    .trim()

    .split(/\n+/)

    .map(
        (x:string)=>

            x.trim()

            .replace(/\s+/g,' ')
    )

    .filter(
        (x:string)=>

            x.length > 0
    )

    .join('\n');
}

export function judge(
    expected: string,
    actual: string
) {

    return (
        normalize(expected)
        ===
        normalize(actual)
    );
}
