/**
 * A library for integrating Friendly Captcha into your website.
 * This SDK allows you to create captcha widgets, respond to their changes, and interact with them programmatically.
 *
 * @packageDocumentation
 */

/**
 * Which API endpoint to use for the SDK. Typically `"eu"` or `"global"`, but a URL can be used to specify a custom endpoint.
 * Defaults to "global".
 *
 * Advanced usage: Fallback endpoints can be specified by appending them (comma-separated).
 * The SDK first tries the first endpoint, and then goes through the fallback endpoints in a random order if the first one is not reachable.
 * Note that the `"eu"` and `"global` shortcuts already contain multiple endpoints for redundancy, so you generally don't need to specify fallback endpoints when using those.
 *
 * @public
 */
export declare type APIEndpoint = string | "eu" | "global";

/**
 * @internal
 * The widget triggered automatically because of the `startMode` setting `"auto"`.
 */
export declare interface _AutoTrigger extends _TriggerBase {
    /** Always `"auto"` for `AutoTrigger` */
    tt: "auto";
}

/**
 * Options when creating a widget programmatically.
 * @public
 */
export declare interface CreateWidgetOptions {
    /**
     * The HTML element to mount to, usually this is an element with class `.frc-captcha`.
     */
    element: HTMLElement;
    /**
     * Sitekey of your application, starts with `FC`.
     */
    sitekey?: string;
    /**
     * The name of the field in the form that is set, defaults to `frc-captcha-response`.
     */
    formFieldName?: string | null;
    /**
     * A custom endpoint from which the agent and widgets are loaded.
     */
    apiEndpoint?: APIEndpoint;
    /**
     * Language code such as "en" for English or "de" for German.
     * Defaults to automatic language detection.
     *
     * Usually you should not set this yourself and instead let the widget detect the language automatically.
     */
    language?: string;
    /**
     * The start mode determines the behavior around automatic activation of the widget.
     * Activation here means the challenge gets requested and gets solved. Defaults to `"focus"`.
     *
     * * `"auto"`: the widget gets activated as soon as it is created.
     * * `"focus"`: the widget gets activated as soon as the form above it is focused.
     * * `"none"`: The widget does not start automatically at all, the user needs to press the widget.
     */
    startMode?: StartMode;
    /**
     * The theme for the widget.
     *
     * * `"light"` (default): a light theme with a white background.
     * * `"dark"`: a dark theme with a dark background.
     * * `"auto"`: the theme is automatically chosen based on the user's system preferences.
     */
    theme?: "light" | "dark" | "auto";
}

/**
 * @internal
 * The widget triggered because of a user interaction on the form.
 */
export declare interface _FocusTrigger extends _TriggerBase {
    /** Always `"focus"` for `FocusTrigger` */
    tt: "focus";
    ev: _TriggerEventData;
}

/**
 * Payloads of any of the events that can be dispatched by a widget.
 * @public
 */
export declare type FRCEventData = FRCWidgetStateChangeEventData | FRCWidgetCompleteEventData | FRCWidgetExpireEventData | FRCWidgetErrorEventData | FRCWidgetResetEventData | FRCRiskIntelligenceCompleteEventData | FRCRiskIntelligenceErrorEventData | FRCRiskIntelligenceExpireEventData;

/**
 * A DOM event map for all events that can be dispatched by a widget.
 * @public
 */
export declare interface FRCEventMap {
    [FRCWidgetStateChangeEventName]: FRCWidgetStateChangeEvent;
    [FRCWidgetCompleteEventName]: FRCWidgetCompleteEvent;
    [FRCWidgetExpireEventName]: FRCWidgetWidgetExpireEvent;
    [FRCWidgetErrorEventName]: FRCWidgetWidgetErrorEvent;
    [FRCWidgetResetEventName]: FRCWidgetWidgetResetEvent;
    [FRCRiskIntelligenceCompleteEventName]: FRCRiskIntelligenceCompleteEvent;
    [FRCRiskIntelligenceErrorEventName]: FRCRiskIntelligenceErrorEvent;
    [FRCRiskIntelligenceExpireEventName]: FRCRiskIntelligenceExpireEvent;
}

/**
 * Names of any of the events that can be dispatched by a widget.
 * @public
 */
export declare type FRCEventName = keyof FRCEventMap;

/**
 * Event that gets dispatched when a Risk Intelligence token has been successfully generated.
 * @public
 */
export declare type FRCRiskIntelligenceCompleteEvent = CustomEvent<FRCRiskIntelligenceCompleteEventData>;

/**
 * Payload of the `"frc:riskintelligence.complete"` event.
 * @public
 */
export declare interface FRCRiskIntelligenceCompleteEventData {
    /**
     * `"frc:riskintelligence.complete"`
     */
    name: typeof FRCRiskIntelligenceCompleteEventName;
    /**
     * The Risk Intelligence response token, to be verified server-side.
     */
    token: string;
    /**
     * A timestamp, represented as a Unix epoch, for when the Risk Intelligence token will expire.
     */
    expiresAt: number;
}

/**
 * `"frc:riskintelligence.complete"`
 * @public
 */
export declare const FRCRiskIntelligenceCompleteEventName = "frc:riskintelligence.complete";

/**
 * Event that gets dispatched when the Risk Intelligence request fails.
 * @public
 */
export declare type FRCRiskIntelligenceErrorEvent = CustomEvent<FRCRiskIntelligenceErrorEventData>;

/**
 * Payload of the `"frc:riskintelligence.error"` event.
 * @public
 */
export declare interface FRCRiskIntelligenceErrorEventData {
    /**
     * `"frc:riskintelligence.error"`
     */
    name: typeof FRCRiskIntelligenceErrorEventName;
    /**
     * The error that occurred.
     */
    error: RiskIntelligenceErrorData;
}

/**
 * `"frc:riskintelligence.error"`
 * @public
 */
export declare const FRCRiskIntelligenceErrorEventName = "frc:riskintelligence.error";

/**
 * Event that gets dispatched when a Risk Intelligence token expires.
 * @public
 */
export declare type FRCRiskIntelligenceExpireEvent = CustomEvent<FRCRiskIntelligenceExpireEventData>;

/**
 * Payload of the `"frc:riskintelligence.expire"` event.
 * @public
 */
export declare interface FRCRiskIntelligenceExpireEventData {
    /**
     * `"frc:riskintelligence.expire"`
     */
    name: typeof FRCRiskIntelligenceExpireEventName;
}

/**
 * `"frc:riskintelligence.expire"`
 * @public
 */
export declare const FRCRiskIntelligenceExpireEventName = "frc:riskintelligence.expire";

/**
 * Event that gets dispatched when the widget is completed. This happens when the user's browser has succesfully passed the captcha challenge.
 * @public
 */
export declare type FRCWidgetCompleteEvent = CustomEvent<FRCWidgetCompleteEventData>;

/**
 * Payload of the `"frc:widget.complete"` event.
 * @public
 */
export declare interface FRCWidgetCompleteEventData {
    /**
     * `"frc:widget.complete"`
     */
    name: typeof FRCWidgetCompleteEventName;
    state: "completed";
    /**
     * The current `frc-captcha-response` value.
     */
    response: string;
    /**
     * The widget ID that the event originated from.
     */
    id: string;
}

/**
 * `"frc:widget.complete"`
 * @public
 */
export declare const FRCWidgetCompleteEventName = "frc:widget.complete";

/**
 * Payload of the `"frc:widget.error"` event.
 * @public
 */
export declare interface FRCWidgetErrorEventData {
    /**
     * `"frc:widget.error"`
     */
    name: typeof FRCWidgetErrorEventName;
    state: "error";
    /**
     * The current `frc-captcha-response` value.
     */
    response: string;
    /**
     * The error that caused the state change.
     */
    error: WidgetErrorData;
    /**
     * The widget ID that the event originated from.
     */
    id: string;
}

/**
 * `"frc:widget.error"`
 * @public
 */
export declare const FRCWidgetErrorEventName = "frc:widget.error";

/**
 * Payload of the `"frc:widget.expire"` event.
 * @public
 */
export declare interface FRCWidgetExpireEventData {
    /**
     * `"frc:widget.expire"`
     */
    name: typeof FRCWidgetExpireEventName;
    state: "expired";
    /**
     * The current `frc-captcha-response` value.
     */
    response: string;
    /**
     * The widget ID that the event originated from.
     */
    id: string;
}

/**
 * `"frc:widget.expire"`
 * @public
 */
export declare const FRCWidgetExpireEventName = "frc:widget.expire";

/**
 * Payload of the `"frc:widget.reset"` event.
 * @public
 */
export declare interface FRCWidgetResetEventData {
    /**
     * `"frc:widget.reset"`
     */
    name: typeof FRCWidgetResetEventName;
    state: "reset";
    /**
     * The current `frc-captcha-response` value.
     */
    response: string;
    /**
     * What caused the reset. Possible values:
     * * `"widget"`: reset initiated by the widget (`"widget"`), which generally means the user clicked the reset button within the widget.
     * * `"root"`: triggered by your own code on the current page (by calling `widget.reset()`).
     * * `"agent"`: triggered by the background agent (currently never happens).
     */
    trigger: WidgetResetTrigger;
    /**
     * The widget ID that the event originated from.
     */
    id: string;
}

/**
 * `"frc:widget.reset"`
 * @public
 */
export declare const FRCWidgetResetEventName = "frc:widget.reset";

/**
 * Event that gets dispatched when the widget enters a new state.
 * @public
 */
export declare type FRCWidgetStateChangeEvent = CustomEvent<FRCWidgetStateChangeEventData>;

/**
 * Payload of the `"frc:widget.statechange"` event.
 * @public
 */
export declare interface FRCWidgetStateChangeEventData {
    /**
     * `"frc:widget.statechange"`
     */
    name: typeof FRCWidgetStateChangeEventName;
    /**
     * The new state of the widget.
     */
    state: WidgetState;
    /**
     * The current `frc-captcha-response` value.
     */
    response: string;
    /**
     * The WidgetMode returned from the API. Smart Mode intelligently chooses between
     * One-click Mode ("interactive") and Zero-click Mode ("noninteractive"). The mode is configured
     * in the Friendly Captcha dashboard.
     *
     * @remarks
     * The API chooses the mode during activation, meaning that the mode will not be available prior
     * to the `"activated"` state. In other words, `mode` will be only be present for `"activated"`,
     * `"requesting"`, `"solving"`, `"verifying"`, `"completed"`, and `"error"`. For other states, it
     * will be `undefined`. See the [widget lifecycle](../lifecycle) docs for more information.
     */
    mode?: WidgetMode;
    /**
     * The error that caused the state change, if any. Undefined if `state` is not equal to `"error"`.
     */
    error?: WidgetErrorData;
    /**
     * The widget ID that the event originated from.
     */
    id: string;
}

/**
 * `"frc:widget.statechange"`
 * @public
 */
export declare const FRCWidgetStateChangeEventName = "frc:widget.statechange";

/**
 * Event that gets dispatched when something goes wrong in the widget.
 * @public
 */
export declare type FRCWidgetWidgetErrorEvent = CustomEvent<FRCWidgetErrorEventData>;

/**
 * Event that gets dispatched when the widget expires. This happens when the user takes too long to submit the captcha after it is solved.
 * @public
 */
export declare type FRCWidgetWidgetExpireEvent = CustomEvent<FRCWidgetExpireEventData>;

/**
 * Event that gets dispatched when something goes wrong in the widget.
 * @public
 */
export declare type FRCWidgetWidgetResetEvent = CustomEvent<FRCWidgetResetEventData>;

/**
 * Main entry point for V2 of the Friendly Captcha SDK. This class keeps track of widgets and allows you to create widgets programmatically.
 *
 * Generally there should only be one instance of this SDK in your website.
 * @public
 */
export declare class FriendlyCaptchaSDK {
    private apiEndpoint?;
    /**
     * Multiple agents may be running at the same time, this is the case if someone uses widgets with different endpoints on a single page.
     * This is a mapping from the origin to the IFrame.
     */
    private agents;
    /**
     * A mapping from the agent ID to its local state.
     */
    private agentState;
    /**
     * Mapping of widget ID to the widget handle.
     */
    private widgets;
    /**
     * @internal
     */
    private bus;
    private _attached;
    /**
     * A promise that resolves to all the widgets that are currently attached.
     * @public
     */
    attached: Promise<WidgetHandle[]>;
    /**
     * A mapping of random IDs to promises that resolve to a risk intelligence
     * token generation response. Each call to `riskIntelligence()` will return
     * a promise that gets a unique ID. The mapping is used for tying the agent
     * message to its reply.
     */
    private riskIntelligencePromises;
    /**
     * A mapping of random IDs to promises that resolve when a risk intelligence
     * clear request completes. Each call to `clearRiskIntelligence()`  will return
     * a promise that gets a unique ID. The mapping is used for tying the agent message
     * to its reply.
     */
    private clearRiskIntelligencePromises;
    /**
     * A list of handles (objects that manage a Risk Intelligence DOM element)
     * associated with the SDK instance.
     */
    private riskIntelligenceHandles;
    /**
     * @internal
     */
    private signals;
    private getRetryOrigins;
    constructor(opts?: FriendlyCaptchaSDKOptions);
    private onReceiveMessage;
    private handleRiskIntelligenceMessage;
    private handleWidgetLanguageChange;
    private handleSignalsGetMessage;
    private handleStoreMessage;
    /**
     * Ensures an agent iframe exists for the configured primary origin in `retryOrigins`.
     *
     * Reuses an existing iframe when possible (within this SDK instance and across SDK
     * instances on the same page), otherwise creates and registers a new one with retry
     * failover across `retryOrigins`.
     *
     * @param retryOrigins - Ordered retry origins with the primary origin at index 0.
     * @returns String - The agent ID for the reused or newly created iframe.
     */
    private ensureAgentIFrame;
    /**
     * @internal
     */
    private setupPeriodicRefresh;
    /**
     * @internal
     */
    private getRetryTimeout;
    /**
     * Attaches a widget to given element or elements if they are not attached to yet.
     *
     * You can pass one or more HTML elements to attach to, or undefined. If `undefined` is passed, the HTML page is scanned
     * for unattached widget elements (= elements with the `frc-captcha` class).
     *
     * Returns handles to the newly-attached elements.
     * @public
     */
    attach(elements?: HTMLElement | HTMLElement[] | NodeListOf<Element>): WidgetHandle[];
    /**
     * Creates a Friendly Captcha widget with given options under given HTML element.
     * @public
     */
    createWidget(opts: CreateWidgetOptions): WidgetHandle;
    /**
     * Creates a Risk Intelligence token generation request, returning a Promise that resolves
     * to the generated token.
     *
     * @public
     */
    riskIntelligence(opts: RiskIntelligenceOptions): Promise<RiskIntelligenceGenerateData>;
    /**
     * Clears cached Risk Intelligence tokens. Cached tokens for a given sitekey can be cleared
     * by specifying it; if a sitekey is not specified, all tokens will be cleared from the cache.
     *
     * @public
     */
    clearRiskIntelligence(opts?: RiskIntelligenceClearOptions): Promise<any>;
    /**
     * Returns all current widgets known about (in an unspecified order).
     * @public
     */
    getAllWidgets(): WidgetHandle[];
    /**
     * Retrieves a widget by its widget ID.
     * @public
     */
    getWidgetById(id: string): WidgetHandle | undefined;
    /**
     * Returns all current Risk Intelligence handles known about (in an unspecified order).
     * @public
     */
    getAllRiskIntelligenceHandles(): RiskIntelligenceHandle[];
    /**
     * Completely remove all widgets and background agents related to the SDK on this page.
     * @public
     */
    clear(): void;
}

/**
 * Options when creating a new SDK instance.
 * @public
 */
export declare interface FriendlyCaptchaSDKOptions {
    /**
     * Start the background agent (and solver) immediately, defaults to `true`.
     */
    startAgent?: boolean;
    /**
     * The API endpoint to use, defaults to `https://global.frcapi.com`.
     *
     * Supports the following shortcuts:
     * - `eu` - `https://eu.frcapi.com`
     * - `global` - `https://global.frcapi.com`
     */
    apiEndpoint?: APIEndpoint;
    /**
     * Whether to disable the patching of `window.eval`. Useful when the patching breaks your site, which in particular
     * may affect some hot reloading functionality for Webpack (in `dev` mode).
     */
    disableEvalPatching?: boolean;
}

/**
 * @internal
 * The widget was triggered programmatically.
 **/
export declare interface _ProgrammaticTrigger extends _TriggerBase {
    /** Always `"programmatic"` for `ProgrammaticTrigger` */
    tt: "programmatic";
}

/**
 * Options for clearing cached Risk Intelligence tokens.
 * @public
 */
export declare interface RiskIntelligenceClearOptions {
    /**
     * Sitekey of your application, starts with `FC`. Tokens associated with this application
     * will be cleared. If not passed, all tokens will be cleared.
     */
    sitekey?: string;
    /**
     * Tokens generated by this API endpoint will be cleared.
     */
    apiEndpoint?: APIEndpoint;
}

/**
 * Error codes that can be returned by the Risk Intelligence request.
 *
 * See {@link WidgetErrorCode} for the list of possible error codes.
 *
 * @public
 */
export declare type RiskIntelligenceErrorCode = WidgetErrorCode;

/**
 * Error data returned by a failed Risk Intelligence request.
 * @public
 */
export declare interface RiskIntelligenceErrorData {
    /**
     * The error code.
     */
    code: RiskIntelligenceErrorCode;
    /**
     * More details about the error to help debugging.
     * This value is not localized and will change between versions.
     *
     * You can print this to the console, but make sure not to depend on it in your code.
     */
    detail: string;
}

/**
 * Data returned by the Risk Intelligence API request.
 * @public
 */
export declare interface RiskIntelligenceGenerateData {
    /**
     * The Risk Intelligence token, which can be used to retrieve Risk Intelligence
     * from the Friendly Captcha API.
     */
    token: string;
    /**
     * A timestamp, represented as a Unix epoch, for when the Risk Intelligence token will expire.
     */
    expiresAt: number;
}

/**
 * This provides a handle for configuring and managing a Risk Intelligence request
 * via an HTML element.
 *
 * This class is only instantiated by the SDK - do not create a handle yourself.
 *
 * @public
 */
export declare class RiskIntelligenceHandle {
    /**
     * The element that configures the Risk Intelligence request,
     * and under which the hidden input element is mounted.
     */
    private readonly e;
    /**
     * This will be undefined if we explicitly asked for no hidden form field.
     */
    private hiddenFormEl?;
    /**
     * A timeout ID used for firing an expiration event when this handle's
     * token expires.
     */
    private timeout;
    private data;
    /**
     * A function that closes over configuration parameters from the HTML element's
     * `data-*` attributes, used for requesting Risk Intelligence.
     */
    private requestRiskIntelligence;
    /**
     * The field in the form that should be set, `null` if no form field should be set.
     * You usually don't want to change this.
     *
     * Defaults to `"frc-risk-intelligence-token"`.
     */
    private formFieldName;
    private startMode;
    /**
     * This class is only instantiated by the SDK by calling FriendlyCaptchaSDK.attach()
     * Do not create a handle manually.
     *
     * @internal
     */
    constructor(opts: {
        element: HTMLElement;
        formFieldName?: string;
        startMode?: StartMode;
        riskIntelligence: () => Promise<RiskIntelligenceGenerateData>;
    });
    private handleStartMode;
    private request;
    /**
     * @returns Risk Intelligence data if request is done and `null` if not.
     */
    getData(): RiskIntelligenceGenerateData | null;
    /**
     * @returns The HTML element used to configure the Risk Intelligence request.
     */
    getElement(): HTMLElement;
    /**
     * Shorthand for `this.getElement().addEventListener`  (that is strictly typed in Typescript)
     */
    addEventListener<K extends keyof FRCEventMap>(type: K, listener: (this: HTMLElement, ev: FRCEventMap[K]) => any | {
        handleEvent: (ev: FRCEventMap[K]) => any;
    }, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for `this.getElement().removeEventListener` (that is strictly typed in Typescript)
     */
    removeEventListener<K extends keyof FRCEventMap>(type: K, listener: (this: HTMLElement, ev: FRCEventMap[K]) => any | {
        handleEvent: (ev: FRCEventMap[K]) => any;
    }, options?: EventListenerOptions): void;
}

/**
 * Options for configuring a Risk Intelligence request.
 * @public
 */
export declare interface RiskIntelligenceOptions {
    /**
     * Sitekey of your application, starts with `FC`.
     */
    sitekey: string;
    /**
     * A custom endpoint from which the agent is loaded and to which Risk Intelligence
     * requests are made.
     */
    apiEndpoint?: APIEndpoint;
    /**
     * Whether to bypass the token cache and force the request of a new token from the
     * API.
     */
    bypassCache?: boolean;
}

/**
 * @internal
 * Data that describes the event that triggered the widget.
 */
export declare type _RootTrigger = _FocusTrigger | _ProgrammaticTrigger | _AutoTrigger;

/**
 * Response values used in the hidden input field when no valid solution is present,
 * these tell you something about the state of the widget.
 *
 * @public
 */
export declare type SentinelResponse = ".UNINITIALIZED" | ".UNCONNECTED" | ".UNSTARTED" | ".REQUESTING" | ".SOLVING" | ".VERIFYING" | ".EXPIRED" | ".DESTROYED" | ".ERROR" | ".ERROR.UNREACHABLE" | ".RESET";

/**
 * The start mode of the widget.
 *
 * * `"auto"`: the widget gets activated as soon as it is created.
 * * `"focus"`: the widget gets activated as soon as the form above it is focused.
 * * `"none"`: The widget does not get activated automatically at all, the user needs to press the widget (or `.start()` gets called using the Javascript API).
 *
 * @public
 */
export declare type StartMode = "focus" | "auto" | "none";

/**
 * @internal
 * Common fields for all trigger types.
 */
export declare interface _TriggerBase {
    /** Compatibility version, always 1 for now. */
    v: 1;
    /** The time the widget was triggered. */
    pnow: number;
    /** What triggered the widget. */
    tt: _TriggerType;
    /** The start mode of the widget. */
    sm: StartMode | "";
    /** Information about the element that the trigger happened to. */
    el: _TriggerElementData;
    /** error stack */
    stack: string;
    /** `window.event` is truthy */
    we: boolean;
    /** `window.event.isTrusted` is truthy */
    weit: boolean;
}

/**
 * @internal
 * Tells us something about the widget within the page.
 */
export declare interface _TriggerElementData {
    /** `element.getBoundingClientRect()` */
    bcr: [number, number, number, number];
    /** `document.body.contains` */
    con: boolean;
}

/**
 * @internal
 */
export declare interface _TriggerEventData {
    /** `event.timeStamp` */
    ts: number;
    /** `event.relatedTarget` is truthy */
    rt: boolean;
    /** `event.explicitOriginalTarget` is truthy */
    eot: boolean;
    /** `event.isTrusted` */
    it: boolean;
}

/**
 * A way the widget can be triggered.
 * @internal
 */
export declare type _TriggerType = "auto" | "focus" | "programmatic" | "widget";

/**
 * Error codes that can be returned by the widget.
 *
 * * `"network_error"`: The user's browser could not connect to the Friendly Captcha API.
 * * `"sitekey_invalid"`: The sitekey is invalid.
 * * `"sitekey_missing"`: The sitekey is missing.
 * * `"other"`: Some other error occurred.
 *
 * In all cases it's the best practice to enable the "submit" button when the widget errors, so that the user can still
 * perform the action despite not having solved the captcha.
 *
 * @public
 */
export declare type WidgetErrorCode = "network_error" | "sitekey_invalid" | "sitekey_missing" | "other";

/**
 * @public
 */
export declare interface WidgetErrorData {
    /**
     * The error code.
     */
    code: WidgetErrorCode;
    /**
     * Localization key, such as `t_verification_failed`.
     */
    title?: string;
    /**
     * More details about the error to help debugging.
     * This value is not localized and will change between versions.
     *
     * You can print this to the console, but make sure not to depend on it in your code.
     */
    detail: string;
}

/**
 * This provides an API stub that provides the end-user JS API for a widget.
 *
 * This class is only instantiated by the SDK - do not create a handle yourself.
 *
 * @public
 */
export declare class WidgetHandle {
    /**
     * A random ID that uniquely identifies this widget in this session.
     */
    readonly id: string;
    /**
     *  The element the widget is mounted under.
     * */
    private readonly e;
    private hiddenFormEl?;
    /**
     * The field in the form that should be set, `null` if no form field should be set.
     * You usually don't want to change this.
     *
     * Defaults to `"frc-captcha-response"`.
     */
    private formFieldName;
    /**
     * The sitekey for this widget. It can not be changed after creation of the widget.
     * @public
     */
    readonly sitekey?: string;
    startMode: StartMode;
    private state;
    private response;
    private focusEventPending;
    private _reset;
    private _destroy;
    private _trigger;
    /**
     * @internal
     */
    readonly ready: Promise<undefined>;
    /**
     * When this is true the widget has been destroyed and can no longer be used.
     */
    isDestroyed: boolean;
    /**
     * You don't want to create this yourself, use `FriendlyCaptcha.createWidget` instead.
     * @internal
     */
    constructor(opts: _WidgetHandleOpts);
    private handleStartMode;
    /**
     * Reset the widget, removing any progress.
     *
     * Optional argument: an object with the name of the trigger that caused the reset.
     * You would usually keep this empty. This is the `trigger` field in the `frc:widget.reset` event, which defaults to `root`.
     */
    reset(opts?: WidgetResetOptions): void;
    /**
     * Destroy the widget.
     *
     * This removes the `element` that the widget was mounted to as well as the hidden `frc-captcha-response` form field.
     */
    destroy(): void;
    /**
     * @internal
     */
    private trigger;
    /**
     * Trigger the widget to start a challenge.
     * The widget will start a challenge solving in the background.
     *
     * * In `interactive` mode, the user will need to click the widget to complete the process.
     * * In `noninteractive` mode, the widget will complete the process automatically.
     *
     */
    start(): void;
    /**
     * Sets the state of the widget, this is for internal use.
     * It is unlikely this is useful to call yourself.
     * @internal
     */
    setState(s: {
        response: SentinelResponse | string;
        state: WidgetState;
        error?: WidgetErrorData;
        resetTrigger?: WidgetResetTrigger;
        mode?: WidgetMode;
    }): void;
    private dispatchWidgetEvent;
    /**
     * Shorthand for `this.getElement().addEventListener`  (that is strictly typed in Typescript)
     */
    addEventListener<K extends keyof FRCEventMap>(type: K, listener: (this: HTMLElement, ev: FRCEventMap[K]) => any | {
        handleEvent: (ev: FRCEventMap[K]) => any;
    }, options?: AddEventListenerOptions): void;
    /**
     * Shorthand for `this.getElement().removeEventListener` (that is strictly typed in Typescript)
     */
    removeEventListener<K extends keyof FRCEventMap>(type: K, listener: (this: HTMLElement, ev: FRCEventMap[K]) => any | {
        handleEvent: (ev: FRCEventMap[K]) => any;
    }, options?: EventListenerOptions): void;
    /**
     * The current state of the widget.
     */
    getState(): WidgetState;
    /**
     * The current response of the widget. This is the value that should be sent to the server and is embedded in HTML forms.
     */
    getResponse(): string;
    /**
     * The HTML element that contains the widget.
     */
    getElement(): HTMLElement;
}

/**
 * Used internally only, this is the data injected into newly created widget handles.
 * @internal
 */
export declare interface _WidgetHandleOpts {
    /**
     * ID for the widget
     */
    id: string;
    /**
     * The options passed when creating the widget.
     */
    createOpts: CreateWidgetOptions;
    callbacks: _WidgetRootCallbacks;
    registered: Promise<undefined>;
}

/**
 * The mode of the widget.
 * * `"interactive"` (default): the widget is interactive: the user needs to click the checkbox to finalize the captcha.
 *   This mode offers the best anti-bot protection.
 * * `"noninteractive"`: the widget is non-interactive: the captcha is solved without any user interaction required.
 *
 * @public
 */
export declare type WidgetMode = "interactive" | "noninteractive";

/**
 * The options object you can pass to the `widget.reset()` method.
 * @public
 */
export declare interface WidgetResetOptions {
    /**
     * You usually don't set this yourself, defaults to `root` for user code.
     * @internal
     */
    trigger?: WidgetResetTrigger;
}

/**
 * What caused the widget to reset.
 * * `root`: Code on the root page (= your website code or plugin) caused the reset.
 * * `widget`: The reset came from the widget. The user likely clicked the reset button within the widget.
 * * `agent`: The reset came from the agent - this currently does not happen but may in the future.
 *
 * @public
 */
export declare type WidgetResetTrigger = "widget" | "root" | "agent";

/**
 * Used internally only.
 * @internal
 */
export declare interface _WidgetRootCallbacks {
    /**
     * Called when the widget is reset.
     * This can be caused because the widget was reset programmatically, or by someone clicking the reset button in the widget.
     */
    onReset: (opts: WidgetResetOptions) => void;
    /**
     * Called when the widget is destroyed.
     * This is caused by the website's code calling `widget.destroy()`.
     */
    onDestroy: () => void;
    /**
     * Called when the widget is triggered from within the root page.
     *
     * This is caused by the website's code calling `widget.start()`, by the widget being automatically triggered, or by the user focusing the form in `focus` mode.
     */
    onTrigger: (data: {
        trigger: _RootTrigger;
    }) => void;
}

/**
 * The state the widget is in. See the [widget lifecycle](../lifecycle) docs for more information.
 * @public
 */
export declare type WidgetState = "init" | "reset" | "unactivated" | "activating" | "activated" | "requesting" | "solving" | "verifying" | "completed" | "expired" | "error" | "destroyed";

export { }
