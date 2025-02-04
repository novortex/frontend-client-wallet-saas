export const formatToTwoDecimalPlaces = (value: number): number => {
    console.log('valor', value)
    return parseFloat(value.toFixed(2));
};
