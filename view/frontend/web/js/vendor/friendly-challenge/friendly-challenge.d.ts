interface Localization {
    text_init: string;
    text_ready: string;
    button_start: string;
    text_fetching: string;
    text_solving: string;
    text_completed: string;
    text_completed_sr: string;
    text_expired: string;
    button_restart: string;
    text_error: string;
    button_retry: string;
    text_fetch_error: string;
    rtl?: boolean;
}
declare const localizations: {
    en: Localization;
    de: Localization;
    nl: Localization;
    fr: Localization;
    it: Localization;
    pt: Localization;
    es: Localization;
    ca: Localization;
    ja: Localization;
    da: Localization;
    ru: Localization;
    sv: Localization;
    tr: Localization;
    el: Localization;
    uk: Localization;
    bg: Localization;
    cs: Localization;
    sk: Localization;
    no: Localization;
    fi: Localization;
    lv: Localization;
    lt: Localization;
    pl: Localization;
    et: Localization;
    hr: Localization;
    sr: Localization;
    sl: Localization;
    hu: Localization;
    ro: Localization;
    zh: Localization;
    zh_tw: Localization;
    vi: Localization;
    he: Localization;
    th: Localization;
    kr: Localization;
    nb: Localization;
};

interface WidgetInstanceOptions {
    /**
     * Don't set this to true unless you want to see what the experience is like for people using very old browsers.
     * This does not increase security.
     */
    forceJSFallback: boolean;
    skipStyleInjection: boolean;
    startMode: "auto" | "focus" | "none";
    puzzleEndpoint: string;
    language: keyof typeof localizations | Localization;
    solutionFieldName: string;
    styleNonce: string;
    sitekey: string;
    readyCallback: () => any;
    startedCallback: () => any;
    doneCallback: (solution: string) => any;
    errorCallback: (error: any) => any;
}
declare class WidgetInstance {
    private puzzle?;
    private workerGroup;
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
    private expiryTimeout;
    constructor(element: HTMLElement, options?: Partial<WidgetInstanceOptions>);
    init(forceStart?: boolean): void;
    /**
     * Loads the configured language, or a language passed to this function.
     * Note that only the next update will be in the new language, consider calling `reset()` after switching languages.
     */
    loadLanguage(lang?: keyof typeof localizations | Localization): void;
    /**
     * Add a listener to the button that calls `this.start` on click.
     */
    private makeButtonStart;
    private onWorkerError;
    private initWorkerGroup;
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

export { Localization, WidgetInstance, WidgetInstanceOptions, localizations };
