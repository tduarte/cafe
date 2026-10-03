/*
 * Cafe - Coffee beans and water ratio calculator
 * Copyright (C) 2024  Tiago Duarte
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ComboRow } from "@gtkx/components/adw";
import * as Gtk from "@gtkx/gi/gtk";
import {
    AdwAboutDialog,
    AdwApplication,
    AdwApplicationWindow,
    AdwHeaderBar,
    AdwPreferencesDialog,
    AdwPreferencesGroup,
    AdwPreferencesPage,
    AdwSpinRow,
    AdwToolbarView,
} from "@gtkx/jsx/adw";
import { GMenu, GSimpleAction } from "@gtkx/jsx/gio";
import { GtkAdjustment, GtkMenuButton } from "@gtkx/jsx/gtk";
import { quit } from "@gtkx/react";
import { useRef, useState } from "react";
import {
    BREWING_RATIOS,
    coffeeFromMetric,
    coffeeToMetric,
    formatNumber,
    MAX_WATER_ML,
    maxCoffeeGrams,
    waterFromMetric,
    waterToMetric,
    type BrewingMethod,
    type UnitSystem,
} from "./utils/calculations.js";

const BREWING_METHODS: { id: BrewingMethod; value: string }[] = [
    { id: "espresso", value: "Espresso" },
    { id: "pourOver", value: "Pour Over" },
    { id: "frenchPress", value: "French Press" },
    { id: "aeroPress", value: "AeroPress" },
];

const UNIT_SYSTEMS: { id: UnitSystem; value: string }[] = [
    { id: "metric", value: "Metric" },
    { id: "imperial", value: "Imperial" },
];

const isBrewingMethod = (id: string): id is BrewingMethod => id in BREWING_RATIOS;
const isUnitSystem = (id: string): id is UnitSystem => id === "metric" || id === "imperial";

// Spin rows report values rounded to their displayed digits, so a value within half a
// display step of what we set is the echo of a programmatic update, not a user edit.
const sameDisplayed = (a: number, b: number, digits: number) => Math.abs(a - b) <= 0.5 * 10 ** -digits + 1e-9;

type Dialog = "none" | "preferences" | "about";

type Brew = { grams: number; method: BrewingMethod; units: UnitSystem };

// Everything shown is derived from the coffee weight in grams, so switching units or
// methods converts the display without accumulating rounding errors.
const displayAmounts = ({ grams, method, units }: Brew) => {
    const metric = units === "metric";
    const waterMl = grams / BREWING_RATIOS[method];
    return {
        coffee: metric ? grams : coffeeFromMetric(grams),
        water: metric ? waterMl : waterFromMetric(waterMl),
        maxCoffee: metric ? maxCoffeeGrams(method) : coffeeFromMetric(maxCoffeeGrams(method)),
        maxWater: metric ? MAX_WATER_ML[method] : waterFromMetric(MAX_WATER_ML[method]),
        coffeeDigits: metric ? 1 : 2,
        waterDigits: metric ? 0 : 2,
    };
};

const MainWindow = () => {
    const [brew, setBrewState] = useState<Brew>({ grams: 20, method: "pourOver", units: "metric" });
    const [dialog, setDialog] = useState<Dialog>("none");
    // Latest brew, readable from signal handlers that fire before React re-renders.
    const brewRef = useRef(brew);

    const setBrew = (next: Brew) => {
        const grams = Math.min(Math.max(next.grams, 0), maxCoffeeGrams(next.method));
        brewRef.current = { ...next, grams };
        setBrewState(brewRef.current);
    };

    const handleCoffeeChange = (value: number) => {
        const current = brewRef.current;
        const shown = displayAmounts(current);
        if (sameDisplayed(value, shown.coffee, shown.coffeeDigits)) return;
        setBrew({ ...current, grams: current.units === "metric" ? value : coffeeToMetric(value) });
    };

    const handleWaterChange = (value: number) => {
        const current = brewRef.current;
        const shown = displayAmounts(current);
        if (sameDisplayed(value, shown.water, shown.waterDigits)) return;
        const waterMl = current.units === "metric" ? value : waterToMetric(value);
        setBrew({ ...current, grams: waterMl * BREWING_RATIOS[current.method] });
    };

    // A new method keeps the coffee weight (clamped to that method's limit) and recalculates the water.
    const handleBrewingMethodChange = (method: BrewingMethod) => setBrew({ ...brewRef.current, method });
    const handleUnitSystemChange = (units: UnitSystem) => setBrew({ ...brewRef.current, units });

    const { method: brewingMethod, units: unitSystem } = brew;
    const amounts = displayAmounts(brew);
    const metric = unitSystem === "metric";
    const coffeeUnit = metric ? "g" : "oz";
    const waterUnit = metric ? "ml" : "fl oz";
    const waterExamples = metric
        ? "Usual Espresso is 30 ml, and mug 250 ml"
        : `Usual Espresso is ${formatNumber(waterFromMetric(30))} fl oz and usual mug is ${formatNumber(waterFromMetric(250))} fl oz`;
    const ratio = `Ratio 1:${(1 / BREWING_RATIOS[brewingMethod]).toFixed(0)} (coffee:water)`;
    const coffeeStep = metric ? 0.5 : 0.05;
    const waterStep = metric ? 5 : 0.25;
    // Bounds change with units and method; remount the rows so a new value is never
    // clamped against the old bounds and echoed back as if the user had edited it.
    const rowKey = `${unitSystem}-${brewingMethod}`;

    return (
        <AdwApplicationWindow
            title="Cafe"
            defaultWidth={500}
            defaultHeight={420}
            onCloseRequest={quit}
            actions={
                <>
                    <GSimpleAction name="preferences" onActivate={() => setDialog("preferences")} />
                    <GSimpleAction name="about" onActivate={() => setDialog("about")} />
                </>
            }
        >
            <AdwToolbarView
                topBar={
                    <AdwHeaderBar
                        end={
                            <GtkMenuButton
                                primary
                                iconName="open-menu-symbolic"
                                tooltipText="Main Menu"
                                menuModel={
                                    <GMenu
                                        items={[
                                            { section: [{ label: "Preferences", action: "win.preferences" }] },
                                            { section: [{ label: "About Cafe", action: "win.about" }] },
                                        ]}
                                    />
                                }
                            />
                        }
                    />
                }
            >
                <AdwPreferencesPage>
                    <AdwPreferencesGroup title="Calculator" description="Enter coffee or water amount.">
                        <ComboRow
                            title="Brewing Method"
                            subtitle={ratio}
                            items={BREWING_METHODS}
                            selectedId={brewingMethod}
                            onSelectionChanged={(id) => {
                                if (isBrewingMethod(id)) handleBrewingMethodChange(id);
                            }}
                        />
                        <AdwSpinRow
                            key={`coffee-${rowKey}`}
                            title={`Coffee (${coffeeUnit})`}
                            subtitle="Before grinding"
                            digits={amounts.coffeeDigits}
                            climbRate={coffeeStep}
                            adjustment={
                                <GtkAdjustment
                                    value={amounts.coffee}
                                    lower={0}
                                    upper={amounts.maxCoffee}
                                    stepIncrement={coffeeStep}
                                    pageIncrement={coffeeStep * 10}
                                />
                            }
                            onNotifyValue={(value) => handleCoffeeChange(value ?? 0)}
                        />
                        <AdwSpinRow
                            key={`water-${rowKey}`}
                            title={`Water (${waterUnit})`}
                            subtitle={waterExamples}
                            digits={amounts.waterDigits}
                            climbRate={waterStep}
                            adjustment={
                                <GtkAdjustment
                                    value={amounts.water}
                                    lower={0}
                                    upper={amounts.maxWater}
                                    stepIncrement={waterStep}
                                    pageIncrement={waterStep * 10}
                                />
                            }
                            onNotifyValue={(value) => handleWaterChange(value ?? 0)}
                        />
                    </AdwPreferencesGroup>
                </AdwPreferencesPage>
            </AdwToolbarView>
            {dialog === "preferences" && (
                <AdwPreferencesDialog title="Preferences" onClosed={() => setDialog("none")}>
                    <AdwPreferencesPage>
                        <AdwPreferencesGroup>
                            <ComboRow
                                title="Units"
                                subtitle="All conversions will use this"
                                items={UNIT_SYSTEMS}
                                selectedId={unitSystem}
                                onSelectionChanged={(id) => {
                                    if (isUnitSystem(id)) handleUnitSystemChange(id);
                                }}
                            />
                        </AdwPreferencesGroup>
                    </AdwPreferencesPage>
                </AdwPreferencesDialog>
            )}
            {dialog === "about" && (
                <AdwAboutDialog
                    onClosed={() => setDialog("none")}
                    applicationName="Cafe"
                    applicationIcon="io.github.tduarte.cafe"
                    version="1.0.0"
                    developerName="Thiago Duarte"
                    website="https://github.com/tduarte/cafe"
                    licenseType={Gtk.License.GPL_3_0}
                    comments="Coffee calculator"
                />
            )}
        </AdwApplicationWindow>
    );
};

export const App = () => (
    <AdwApplication actionAccels={[{ detailedActionName: "win.preferences", accels: ["<Control>comma"] }]}>
        <MainWindow />
    </AdwApplication>
);

export default App;
