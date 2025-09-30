export function formatDate(inputDate:string) {
    const date = new Date(inputDate);
    const formatted =
        date.getDate().toString().padStart(2, "0") +
        "/" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        date.getFullYear();

    return formatted;
}