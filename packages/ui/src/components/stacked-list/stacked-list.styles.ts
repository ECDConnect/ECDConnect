// `max-w-1` was here but generated no CSS under Tailwind v2, which had no `1`
// key in its maxWidth scale. v3 derives maxWidth from the spacing scale, which
// turned the dead class into a real 4px cap and collapsed the row.
export const textRowsWrapper = 'overflow-auto flex flex-row items-center';
export const paragraphWrapper = 'flex-1 pr-4 md:grid md:grid-cols-2 md:gap-4';
