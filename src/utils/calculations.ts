// Brewing method ratios (coffee:water)
export const BREWING_RATIOS = {
    espresso: 1 / 2, // 1:2 ratio
    pourOver: 1 / 15, // 1:15 ratio
    frenchPress: 1 / 12, // 1:12 ratio
    aeroPress: 1 / 11, // 1:11 ratio
} as const;

export type BrewingMethod = keyof typeof BREWING_RATIOS;

// Unit conversion constants
export const OUNCES_TO_GRAMS = 28.35;
export const FLUID_OUNCES_TO_MILLILITERS = 29.57;

export type UnitSystem = "metric" | "imperial";

/**
 * Convert coffee amount from imperial to metric
 */
export function coffeeToMetric(amount: number): number {
    return amount * OUNCES_TO_GRAMS;
}

/**
 * Convert coffee amount from metric to imperial
 */
export function coffeeFromMetric(amount: number): number {
    return amount / OUNCES_TO_GRAMS;
}

/**
 * Convert water amount from imperial to metric
 */
export function waterToMetric(amount: number): number {
    return amount * FLUID_OUNCES_TO_MILLILITERS;
}

/**
 * Convert water amount from metric to imperial
 */
export function waterFromMetric(amount: number): number {
    return amount / FLUID_OUNCES_TO_MILLILITERS;
}

/**
 * Calculate water amount from coffee amount
 */
export function calculateWater(coffee: number, method: BrewingMethod, unitSystem: UnitSystem): number {
    const ratio = BREWING_RATIOS[method];
    let coffeeInGrams = unitSystem === "metric" ? coffee : coffeeToMetric(coffee);
    const waterInMl = coffeeInGrams / ratio;
    return unitSystem === "metric" ? waterInMl : waterFromMetric(waterInMl);
}

/**
 * Calculate coffee amount from water amount
 */
export function calculateCoffee(water: number, method: BrewingMethod, unitSystem: UnitSystem): number {
    const ratio = BREWING_RATIOS[method];
    let waterInMl = unitSystem === "metric" ? water : waterToMetric(water);
    const coffeeInGrams = waterInMl * ratio;
    return unitSystem === "metric" ? coffeeInGrams : coffeeFromMetric(coffeeInGrams);
}

/**
 * Format number to 1-2 decimal places
 */
export function formatNumber(value: number): string {
    if (value >= 100) {
        return value.toFixed(1);
    }
    return value.toFixed(2);
}

