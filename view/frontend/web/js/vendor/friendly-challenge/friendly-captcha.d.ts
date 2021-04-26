interface Localization {
    text_init: string;
    text_ready: string;
    button_start: string;
    text_fetching: string;
    text_solving: string;
    text_completed: string;
    text_expired: string;
    button_restart: string;
    text_error: string;
    button_retry: string;
}

interface WidgetInstanceOptions {
    forceJSFallback: boolean;
    startMode: "auto" | "focus" | "none";
    puzzleEndpoint: string;
    language: "en" | "de" | "nl" | "fr" | "it" | Localization;
    solutionFieldName: "frc-captcha-solution";
    sitekey: string;
    readyCallback: () => any;
    startedCallback: () => any;
    doneCallback: (solution: string) => any;
    errorCallback: (error: any) => any;
}
declare class WidgetInstance {
    private worker;
    private puzzle?;
    /**
     * The root element of this widget instance.
     * Warning: it is undefined after `destroy()` has been called.
     */
    private e;
    /**
     * The captcha has been succesfully solved.
     */
    valid: boolean;
    private opts;
    /**
     * Some errors may cause a need for the (worker) to be reinitialized. If this is
     * true `init` will be called again when start is called.
     */
    private needsReInit;
    /**
     * Start() has been called at least once ever.
     */
    private hasBeenStarted;
    private hasBeenDestroyed;
    private lang;
    constructor(element: HTMLElement, options?: Partial<WidgetInstanceOptions>);
    init(forceStart?: boolean): void;
    /**
     * Compile the WASM and send the compiled module to the webworker.
     * If WASM support is not present, it tells the webworker to initialize the JS solver instead.
     */
    private setupSolver;
    /**
     * Add a listener to the button that calls `this.start` on click.
     */
    private makeButtonStart;
    private onWorkerError;
    private initWorker;
    private expire;
    start(): Promise<void>;
    /**
     * This is to be called when the puzzle has been succesfully completed.
     * Here the hidden field gets updated with the solution.
     * @param data message from the webworker
     */
    private handleDone;
    /**
     * Cleans up the widget entirely, removing any DOM elements and terminating any background workers.
     * After it is destroyed it can no longer be used for any purpose.
     */
    destroy(): void;
    /**
     * Resets the widget to the initial state.
     * This is useful in situations where the page does not refresh when you submit and the form may be re-submitted again
     */
    reset(): void;
}

export { WidgetInstance };
