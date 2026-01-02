import * as Adw from "@gtkx/ffi/adw";
import * as Gtk from "@gtkx/ffi/gtk";
import {
    AdwApplicationWindow,
    AdwClamp,
    AdwHeaderBar,
    AdwPreferencesGroup,
    AdwPreferencesPage,
    AdwToolbarView,
    createPortal,
    GtkBox,
    GtkAboutDialog,
    GtkDropDown,
    GtkLabel,
    GtkMenuButton,
    GtkScrolledWindow,
    GtkSpinButton,
    Menu,
    Pack,
    quit,
    SimpleListItem,
    Slot,
    Toolbar,
    useApplication,
} from "@gtkx/react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
    BREWING_RATIOS,
    calculateCoffee,
    calculateWater,
    formatNumber,
    type BrewingMethod,
    type UnitSystem,
} from "./utils/calculations.js";

const BREWING_METHODS: { id: BrewingMethod; name: string }[] = [
    { id: "espresso", name: "Espresso" },
    { id: "pourOver", name: "Pour Over" },
    { id: "frenchPress", name: "French Press" },
    { id: "aeroPress", name: "AeroPress" },
];

const UNIT_SYSTEMS: { id: UnitSystem; name: string }[] = [
    { id: "metric", name: "Metric" },
    { id: "imperial", name: "Imperial" },
];


export const App = () => {
    const [brewingMethod, setBrewingMethod] = useState<BrewingMethod>("pourOver");
    const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
    const [showPreferences, setShowPreferences] = useState(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:50',message:'Initial showPreferences state',data:{value:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        return false;
    });
    const [showAbout, setShowAbout] = useState(false);
    const initialCoffee = 20;
    const [coffeeValue, setCoffeeValue] = useState(initialCoffee);
    const [waterValue, setWaterValue] = useState(() =>
        calculateWater(initialCoffee, "pourOver", "metric")
    );
    const app = useApplication();
    const windowRef = useRef<Adw.ApplicationWindow | null>(null);
    const preferencesWindowRef = useRef<Adw.ApplicationWindow | null>(null);

    // Create adjustments for spin buttons
    const coffeeAdjustment = useMemo(() => {
        const max = unitSystem === "metric" ? 1000 : 35;
        const step = unitSystem === "metric" ? 1 : 0.1;
        const currentValue = Math.min(coffeeValue, max);
        return new Gtk.Adjustment(currentValue, 0, max, step, step * 10, 0);
    }, [unitSystem]);

    const waterAdjustment = useMemo(() => {
        const max = unitSystem === "metric" ? 2000 : 70;
        const step = unitSystem === "metric" ? 1 : 0.1;
        const currentValue = Math.min(waterValue, max);
        return new Gtk.Adjustment(currentValue, 0, max, step, step * 10, 0);
    }, [unitSystem]);

    const coffeeUnit = unitSystem === "metric" ? "g" : "oz";
    const waterUnit = unitSystem === "metric" ? "ml" : "fl oz";

    const handleCoffeeChange = (value: number) => {
        setCoffeeValue(value);
        if (value > 0) {
            setWaterValue(calculateWater(value, brewingMethod, unitSystem));
        }
    };

    const handleWaterChange = (value: number) => {
        setWaterValue(value);
        if (value > 0) {
            setCoffeeValue(calculateCoffee(value, brewingMethod, unitSystem));
        }
    };

    // Update water when brewing method or unit system changes (keeping coffee constant)
    useEffect(() => {
        if (coffeeValue > 0) {
            setWaterValue(calculateWater(coffeeValue, brewingMethod, unitSystem));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brewingMethod, unitSystem]);

    // Track showPreferences changes
    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:107',message:'showPreferences state changed',data:{showPreferences,windowRefExists:!!windowRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
    }, [showPreferences]);


    return (
        <AdwApplicationWindow
            ref={windowRef}
            title="Cafe"
            defaultWidth={520}
            defaultHeight={640}
            onCloseRequest={quit}
        >
            <AdwToolbarView>
                <Toolbar.Top>
                    <AdwHeaderBar>
                        <Slot for={AdwHeaderBar} id="titleWidget">
                            <GtkLabel label="Cafe" cssClasses={["title"]} />
                        </Slot>
                        <Pack.End>
                            {(() => {
                                // #region agent log
                                fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:139',message:'Rendering menu button',data:{showPreferences},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
                                // #endregion
                                const handlePreferences = () => {
                                    // #region agent log
                                    fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:142',message:'Menu item activated',data:{windowRefExists:!!windowRef.current,currentShowPrefs:showPreferences},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
                                    // #endregion
                                    try {
                                        setShowPreferences(true);
                                        // #region agent log
                                        fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:146',message:'State set to true',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
                                        // #endregion
                                    } catch (e) {
                                        // #region agent log
                                        fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:150',message:'Error setting state',data:{error:String(e),stack:e instanceof Error?e.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'E'})}).catch(()=>{});
                                        // #endregion
                                        throw e;
                                    }
                                };
                                const handleAbout = () => {
                                    setShowAbout(true);
                                };
                                return (
                                    <GtkMenuButton iconName="open-menu-symbolic" cssClasses={["flat"]}>
                                        <Menu.Item
                                            id="preferences"
                                            label="Preferences"
                                            onActivate={handlePreferences}
                                            accels="<Control>comma"
                                        />
                                        <Menu.Item id="about" label="About Cafe" onActivate={handleAbout} />
                                    </GtkMenuButton>
                                );
                            })()}
                        </Pack.End>
                    </AdwHeaderBar>
                </Toolbar.Top>

                <GtkScrolledWindow vexpand>
                    <AdwClamp maximumSize={600}>
                        <AdwPreferencesPage>
                            {/* Brewing Method Selection */}
                            <AdwPreferencesGroup title="Brewing Method" description="Select your brewing method">
                                <GtkBox
                                    orientation={Gtk.Orientation.HORIZONTAL}
                                    spacing={12}
                                    marginTop={12}
                                    marginBottom={12}
                                    marginStart={12}
                                    marginEnd={12}
                                >
                                    <GtkLabel label="Method:" halign={Gtk.Align.START} hexpand />
                                    <GtkDropDown
                                        selectedId={brewingMethod}
                                        onSelectionChanged={(id) => setBrewingMethod(id as BrewingMethod)}
                                    >
                                        {BREWING_METHODS.map((method) => (
                                            <SimpleListItem key={method.id} id={method.id} value={method.name} />
                                        ))}
                                    </GtkDropDown>
                                </GtkBox>
                            </AdwPreferencesGroup>


                            {/* Calculator */}
                            <AdwPreferencesGroup title="Calculator" description="Enter coffee or water amount to calculate the other">
                                <GtkBox
                                    orientation={Gtk.Orientation.VERTICAL}
                                    spacing={12}
                                    marginTop={12}
                                    marginBottom={12}
                                    marginStart={12}
                                    marginEnd={12}
                                >
                                    {/* Coffee Input */}
                                    <GtkBox orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
                                        <GtkLabel
                                            label={`Coffee (${coffeeUnit}):`}
                                            halign={Gtk.Align.START}
                                            hexpand
                                        />
                                        <GtkSpinButton
                                            value={coffeeValue}
                                            onValueChanged={(spinButton: Gtk.SpinButton) =>
                                                handleCoffeeChange(spinButton.getValue())
                                            }
                                            adjustment={coffeeAdjustment}
                                            digits={unitSystem === "metric" ? 0 : 2}
                                            climbRate={unitSystem === "metric" ? 1 : 0.1}
                                            widthChars={8}
                                        />
                                    </GtkBox>

                                    {/* Water Input */}
                                    <GtkBox orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
                                        <GtkLabel
                                            label={`Water (${waterUnit}):`}
                                            halign={Gtk.Align.START}
                                            hexpand
                                        />
                                        <GtkSpinButton
                                            value={waterValue}
                                            onValueChanged={(spinButton: Gtk.SpinButton) =>
                                                handleWaterChange(spinButton.getValue())
                                            }
                                            adjustment={waterAdjustment}
                                            digits={unitSystem === "metric" ? 0 : 2}
                                            climbRate={unitSystem === "metric" ? 1 : 0.1}
                                            widthChars={8}
                                        />
                                    </GtkBox>

                                    {/* Ratio Info */}
                                    <GtkBox
                                        orientation={Gtk.Orientation.VERTICAL}
                                        spacing={4}
                                        marginTop={8}
                                    >
                                        <GtkLabel
                                            label={`Ratio: 1:${(1 / BREWING_RATIOS[brewingMethod]).toFixed(0)} (coffee:water)`}
                                            cssClasses={["dim-label", "caption"]}
                                            halign={Gtk.Align.START}
                                        />
                                    </GtkBox>
                                </GtkBox>
                            </AdwPreferencesGroup>
                        </AdwPreferencesPage>
                    </AdwClamp>
                </GtkScrolledWindow>
            </AdwToolbarView>
            {showPreferences && app && windowRef.current && (() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:279',message:'Portal condition check',data:{showPreferences,windowRefExists:!!windowRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:282',message:'About to create portal directly',data:{windowRefCurrent:!!windowRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'D'})}).catch(()=>{});
                // #endregion
                return createPortal(
                    <AdwApplicationWindow
                        ref={(ref) => {
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:287',message:'Ref callback called',data:{refExists:!!ref,refType:ref?.constructor?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'B'})}).catch(()=>{});
                            // #endregion
                            preferencesWindowRef.current = ref;
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:290',message:'Preferences window ref set',data:{refExists:!!preferencesWindowRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'B'})}).catch(()=>{});
                            // #endregion
                        }}
                        title="Preferences"
                        modal
                        transientFor={windowRef.current}
                        defaultWidth={420}
                        defaultHeight={400}
                        onCloseRequest={() => {
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/aeb57910-effe-46a8-9855-c3e20058d469',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.tsx:297',message:'Preferences window close requested',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run5',hypothesisId:'D'})}).catch(()=>{});
                            // #endregion
                            setShowPreferences(false);
                            return false;
                        }}
                    >
                        <AdwToolbarView>
                            <Toolbar.Top>
                                <AdwHeaderBar>
                                    <Slot for={AdwHeaderBar} id="titleWidget">
                                        <GtkLabel label="Preferences" cssClasses={["title"]} />
                                    </Slot>
                                </AdwHeaderBar>
                            </Toolbar.Top>
                            <GtkScrolledWindow vexpand>
                                <AdwClamp maximumSize={600}>
                                    <AdwPreferencesPage>
                                        <AdwPreferencesGroup title="Units" description="Choose your preferred measurement system">
                                            <GtkBox
                                                orientation={Gtk.Orientation.HORIZONTAL}
                                                spacing={12}
                                                marginTop={12}
                                                marginBottom={12}
                                                marginStart={12}
                                                marginEnd={12}
                                            >
                                                <GtkLabel label="Measure System:" halign={Gtk.Align.START} hexpand />
                                                <GtkDropDown
                                                    selectedId={unitSystem}
                                                    onSelectionChanged={(id) => setUnitSystem(id as UnitSystem)}
                                                >
                                                    {UNIT_SYSTEMS.map((system) => (
                                                        <SimpleListItem key={system.id} id={system.id} value={system.name} />
                                                    ))}
                                                </GtkDropDown>
                                            </GtkBox>
                                        </AdwPreferencesGroup>
                                    </AdwPreferencesPage>
                                </AdwClamp>
                            </GtkScrolledWindow>
                        </AdwToolbarView>
                    </AdwApplicationWindow>,
                    app
                );
            })()}
            {showAbout && app && windowRef.current && (() => {
                return createPortal(
                    <GtkAboutDialog
                        programName="Cafe"
                        version="1.0"
                        comments="Coffee calculator"
                        website="https://github.com/tduarte/cafe"
                        modal
                        transientFor={windowRef.current}
                        onCloseRequest={() => {
                            setShowAbout(false);
                            return false;
                        }}
                    />,
                    app
                );
            })()}
        </AdwApplicationWindow>
    );
};

export default App;
