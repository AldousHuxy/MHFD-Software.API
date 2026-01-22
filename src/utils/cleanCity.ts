export const cleanCity = (city: string|undefined): string => {
    const cleanCity = city?.replace(' *', '').replace(', CITY OF', '').replace(', CITY AND COUNTY OF', '').trim() || '';

    return toCapitalizedCity(cleanCity);
}

export const toCapitalizedCity = (city: string|undefined): string => {
    if (!city) return '';
    return city
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}