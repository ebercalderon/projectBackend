"use strict";
const GetMostSoldItems = (productosVendidos, limit) => {
    const frequencyMap = new Map();
    const size = Math.min(productosVendidos.length, limit);
    for (let i = 0; i < size; i++) {
        const prod = productosVendidos[i];
        const ocurrencias = frequencyMap.get(prod) || 0;
        frequencyMap.set(prod, ocurrencias + 1);
    }
    const sortedFrequencyMap = new Map([...frequencyMap.entries()].sort((a, b) => b[1] - a[1]));
    return Array.from(sortedFrequencyMap.keys());
};
