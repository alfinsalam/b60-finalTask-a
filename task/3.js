function recursiveBubbleSort(arr, n = arr.length) {
    if (n === 1) return arr; // Basis rekursi: jika hanya 1 elemen, tidak perlu sorting

    for (let i = 0; i < n - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            // Tukar elemen jika lebih besar
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
    }
    
    return recursiveBubbleSort(arr, n - 1); // Rekursi untuk ukuran array yang lebih kecil
}

function sortArray(arr) {
    let sortedArray = recursiveBubbleSort([...arr]); // Salin array agar tidak merusak aslinya
    
    // Pisahkan bilangan ganjil dan genap
    let oddNumbers = sortedArray.filter(num => num % 2 !== 0);
    let evenNumbers = sortedArray.filter(num => num % 2 === 0);
    
    return {
        Array: sortedArray.join(", "),
        Ganjil: oddNumbers.join(", "),
        Genap: evenNumbers.join(", ")
    };
}

// Contoh penggunaan
let inputArray = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];
console.log(sortArray(inputArray));
