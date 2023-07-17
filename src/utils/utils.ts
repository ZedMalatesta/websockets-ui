export const generateStringMatrix = (n: number, m: number):string[] =>  {
    let array:Array<string> = [];
    for(let i=n; i<m+1; i++){
        for(let j=n; j<m+1; j++){
            array.push(`${i}${j}`);
        }
    }
    return array;
}