// Generated using typescript-generator version 2.32.889 on 2021-10-07 10:46:13.

import * as rest from "@rocketbase/commons-core";

export interface ExpirationInfo<T> {
    expires?: string;
    detail?: T;
    /**
     * duration in seconds after verification-link will expire
     */
    expiresAfter?: number;
    expired: boolean;
}

export interface AppCapabilityRead extends AppCapabilityShort {
    key: string;
    systemRefId?: string;
    /**
     * is capability parent for any other capability in the database
     */
    withChildren: boolean;
    description: string;
    parentId: number;
    created: string;
    modifiedBy: string;
    modified: string;
}

/**
 * short version of AppCapability in oder to link it in response of user + invites
 */
export interface AppCapabilityShort {
    id: number;
    /**
     * calculated path
     *
     * concat each parent0.parent1.key split by .
     */
    keyPath: string;
}

export interface AppCapabilityWrite {
    key: string;
    description?: string;
    systemRefId?: string;
}

/**
 * query object to find {@link AppCapabilityRead}
 * string properties mean search like ignore cases
 */
export interface QueryAppCapability {
    ids?: number[];
    keyPath?: string;
    parentIds?: number[];
    key?: string;
    description?: string;
    systemRefId?: string;
}

export interface AppClientRead {
    id: number;
    systemRefId?: string;
    name: string;
    description: string;
    capabilities: AppCapabilityShort[];
    redirectUrls: string[];
    created: string;
    modifiedBy: string;
    modified: string;
}

export interface AppClientWrite {
    name: string;
    systemRefId?: string;
    description: string;
    capabilityIds: number[];
    redirectUrls: string[];
}

/**
 * query object to find {@link AppClientRead}
 * string properties mean search like ignore cases
 */
export interface QueryAppClient {
    ids?: number[];
    name?: string;
    systemRefId?: string;
    /**
     * client has capability - exact search
     */
    capabilityIds?: number[];
    redirectUrl?: string;
    description?: string;
}

export interface AppGroupRead extends AppGroupShort, rest.HasKeyValue {
    systemRefId?: string;
    name: string;
    description: string;
    /**
     * is group parent for any other group in the database
     */
    withChildren: boolean;
    parentId: number;
    capabilities: AppCapabilityShort[];
    keyValues?: Record<string, string>;
    created: string;
    modifiedBy: string;
    modified: string;
}

/**
 * short version of AppGroup in oder to link it in response of user + invites
 */
export interface AppGroupShort {
    id: number;
    /**
     * calculated tree of parent's names to get also parent names
     *
     * example: /buyers/department/manager
     */
    namePath: string;
}

export interface AppGroupWrite extends rest.HasKeyValue {
    name: string;
    systemRefId?: string;
    description: string;
    capabilityIds: number[];
    keyValues?: Record<string, string>;
}

/**
 * query object to find {@link AppGroupRead}
 * string properties mean search like ignore cases
 */
export interface QueryAppGroup {
    ids?: number[];
    namePath?: string;
    systemRefId?: string;
    name?: string;
    parentIds?: number[];
    description?: string;
    /**
     * search for given key and value with exact match
     */
    keyValues?: Record<string, string>;
    /**
     * group has capability exact search
     */
    capabilityIds?: number[];
}

export interface AppInviteRead extends rest.HasKeyValue, rest.HasFirstAndLastName {
    id: number;
    systemRefId?: string;
    invitor: string;
    message: string;
    firstName?: string;
    lastName?: string;
    email: string;
    capabilities: AppCapabilityShort[];
    keyValues?: Record<string, string>;
    teamInvite?: AppTeamInvite;
    groups?: AppGroupShort[];
    created: string;
    modifiedBy: string;
    modified: string;
    expiration: string;
}

export interface ConfirmInviteRequest extends rest.HasFirstAndLastName {
    inviteId: number;
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface InviteRequest extends rest.HasFirstAndLastName, rest.HasKeyValue {
    systemRefId?: string;
    /**
     * name of invitor that will get displayed within email + form
     */
    invitor: string;
    /**
     * optional message to add to invited person
     */
    message?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    capabilityIds: number[];
    groupIds?: number[];
    keyValues?: Record<string, string>;
    /**
     * optional parameter to overwrite system default
     *
     * full qualified url to a custom UI that proceed the invite
     *
     * ?inviteId=VALUE will get append
     */
    inviteUrl?: string;
    teamInvite?: AppTeamInvite;
}

/**
 * query object to find invites
 * string properties mean search like ignore cases
 */
export interface QueryAppInvite extends rest.HasKeyValue {
    invitor?: string;
    email?: string;
    expired?: boolean;
    /**
     * search for given key and value with exact match ignore cases
     */
    keyValues?: Record<string, string>;
    teamId?: number;
    systemRefId?: string;
}

/**
 * used in case of user/invite creation
 */
export interface AppTeamInvite {
    teamId: number;
    role: AppTeamRole;
}

export interface AppTeamMember {
    userId: string;
    role: AppTeamRole;
}

export interface AppTeamRead extends AppTeamShort {
    systemRefId: string;
    description?: string;
    personal: boolean;
    created: string;
    modifiedBy: string;
    modified: string;
    keyValues?: Record<string, string>;
}

export interface AppTeamShort {
    id: number;
    name: string;
}

export interface AppTeamWrite extends rest.HasKeyValue {
    systemRefId?: string;
    name: string;
    description?: string;
    personal: boolean;
    keyValues?: Record<string, string>;
}

export interface AppUserMembership {
    team: AppTeamShort;
    role: AppTeamRole;
}

/**
 * query object to find {@link AppCapabilityRead}
 * string properties mean search like ignore cases
 */
export interface QueryAppTeam {
    ids?: number[];
    name?: string;
    description?: string;
    personal?: boolean;
    systemRefId?: string;
}

export interface AppUserCreate extends rest.HasFirstAndLastName, rest.HasKeyValue {
    username: string;
    password: string;
    systemRefId?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
    keyValues?: Record<string, string>;
    enabled: boolean;
    capabilityIds?: number[];
    groupIds?: number[];
}

export interface AppUserRead extends AppUserReference, rest.HasKeyValue {
    capabilities: AppCapabilityShort[];
    groups?: AppGroupShort[];
    activeTeam?: AppUserMembership;
    keyValues?: Record<string, string>;
    enabled: boolean;
    locked: boolean;
    created: string;
    modifiedBy: string;
    modified: string;
    lastLogin?: string;
    setting?: UserSetting;
    identityProvider?: string;
}

export interface AppUserResetPassword {
    resetPassword: string;
}

/**
 * null properties mean let value as it is
 */
export interface AppUserUpdate extends rest.HasKeyValue {
    capabilityIds?: number[];
    groupIds?: number[];
    profile?: UserProfile;
    setting?: UserSetting;
    /**
     * will removed key that have value of null
     *
     * will only add/replace new/existing key values
     *
     * not mentioned key will still stay the same
     */
    keyValues?: Record<string, string>;
    enabled?: boolean;
    locked?: boolean;
    activeTeamId?: number;
}

/**
 * query object to find user
 * string properties mean search like ignore cases
 */
export interface QueryAppUser extends rest.HasKeyValue, rest.HasFirstAndLastName {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    systemRefId?: string;
    /**
     * search for given key and value with exact match
     */
    keyValues?: Record<string, string>;
    /**
     * searches for all properties containing text
     */
    freetext?: string;
    /**
     * exact capability search
     */
    capabilityIds?: number[];
    /**
     * user is member of group
     */
    groupIds?: number[];
    enabled?: boolean;
}

export interface AuthAuditRead {
    id: number;
    timestamp: string;
    userId: string;
    /**
     * for example crud / interaction
     */
    eventType: string;
    /**
     * crud: create/read/update/delete
     *
     * interaction: login/refresh_token...
     */
    eventDetail: string;
    /**
     * crud: database-entity-name
     *
     * interaction: service-name/api-endpoint
     */
    source: string;
    /**
     * crud: id of entity
     *
     * interaction: null
     */
    identifier: string;
}

export interface EmailChangeRequest {
    newEmail: string;
}

export interface JwtTokenBundle {
    token: string;
    refreshToken: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    jwtTokenBundle: JwtTokenBundle;
    user: AppUserToken;
}

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UsernameChangeRequest {
    newUsername: string;
}

/**
 * used in oauth context for mainly the "Authorization Code Flow"
 *
 * this is the first request that will answer with an redirect
 */
export interface AuthRequest {
    /**
     * Obtained during either manual client registration or via the Dynamic Client Registration API. It identifies the client and must match the value preregistered in Okta.
     */
    client_id: string;
    /**
     * The display parameter to be passed to the Social Identity Provider when performing Social Login.
     */
    display: string;
    /**
     * A username to prepopulate if prompting for authentication.
     */
    login_hint: string;
    /**
     * Allowable elapsed time, in seconds, since the last time the end user was actively authenticated.
     */
    max_age: number;
    /**
     * Callback location where the authorization code or tokens should be sent. It must match the value preregistered in Okta during client registration.
     */
    redirect_uri: string;
    /**
     * Any combination of code, token, and id_token. The combination determines the flow.
     */
    response_type: string;
    /**
     * openid is required for authentication requests. Other scopes may also be included.
     */
    scope: string;
    /**
     * A value to be returned in the token. The client application can use it to remember the state of its interaction with the end user at the time of the authentication call. It can contain alphanumeric, comma, period, underscore, and hyphen characters. See Parameter details.
     */
    state: string;
}

/**
 * User for multiple flows
 *
 * - Authorization Code Flow (grant_type=grant_type): will be called with filled code and redirect_uri
 *
 * - Resource Owner Password Credentials Flow (grant_type=password): will be called with filled username, password
 *
 * - Refresh Token Flow (grant_type=refresh_token): will be called with refresh_token and scope
 */
export interface TokenRequest {
    /**
     * Can be one of the following: authorization_code, password, client_credentials, refresh_token
     */
    grant_type: string;
    /**
     * Required if grant_type is authorization_code. The value is what was returned from the authorization endpoint. The code has a lifetime of 300 seconds
     */
    code: string;
    /**
     * Required if grant_type is authorization_code. Specifies the callback location where the authorization was sent. This value must match the redirect_uri used to generate the original authorization_code.
     */
    redirect_uri: string;
    /**
     * Required if the grant_type is password.
     */
    username: string;
    /**
     * Required if the grant_type is password.
     */
    password: string;
    /**
     * Required if grant_type is refresh_token. The value is a valid refresh token that was returned from this endpoint previously.
     */
    refresh_token: string;
    /**
     * Required if password is the grant_type. This is a list of scopes that the client wants to be included in the access token. For the refresh_token grant type, these scopes have to be a subset of the scopes used to generate the refresh token in the first place.
     */
    scope: string;
}

/**
 * response of {@link TokenRequest}
 *
 * depending on flow some properties are optional
 */
export interface TokenResponse {
    scope: string;
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_expires_in: number;
    refresh_token: string;
}

export interface ForgotPasswordRequest {
    username?: string;
    email?: string;
    /**
     * optional parameter to overwrite system default
     *
     * full qualified url to a custom UI that proceed the password reset
     *
     * * ?verification=VALUE will get append
     */
    resetPasswordUrl?: string;
    /**
     * please use resetPasswordUrl will get removed in future
     * @deprecated
     */
    verificationUrl?: string;
}

export interface PerformPasswordResetRequest {
    verification: string;
    password: string;
}

export interface ConnectedAuthorization {
    /**
     * a mobile app for example an a desktop app should use different clientIds to support separated auth flows/states
     *
     * an AppUserEntity could hold a set of unique clientId values
     */
    clientId: string;
    /**
     * timestamp of expiration of the refreshToken to know if it's could still be valid to use it...
     */
    refreshExpires: string;
    refreshToken: string;
}

export interface IdentityProvider {
    key: string;
    name: string;
    description: string;
    logo: string;
    endpoints: Endpoints;
    clientId: string;
    clientSecret: string;
    scope: string;
    defaultProvider: boolean;
    /**
     * JSON Web Key Sets
     */
    jwksUri: string;
}

export interface Endpoints {
    issuer: string;
    authorization: string;
    token: string;
    userinfo: string;
    revocation: string;
    endSession: string;
}

export interface WellKnownConfiguration {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    userinfo_endpoint: string;
    registration_endpoint: string;
    response_types_supported: string[];
    response_modes_supported: string[];
    grant_types_supported: string[];
    scopes_supported: string[];
    claims_supported: string[];
    revocation_endpoint: string;
    end_session_endpoint: string;
}

export interface RegistrationRequest extends rest.HasKeyValue, rest.HasFirstAndLastName {
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    keyValues?: Record<string, string>;
    /**
     * optional parameter to overwrite system default
     *
     * full qualified url to a custom UI that proceed the verification
     *
     * * ?verification=VALUE will get append
     */
    verificationUrl?: string;
}

export interface ValidationResponse<T> {
    valid: boolean;
    errorCodes: Record<string, string>;
}

/**
 * a short representation of a user
 *
 * will be used for user-search results for example
 *
 * important: will not keep secrets, audit oder security information like capabilities, passwords or groups
 */
export interface AppUserReference {
    profile?: UserProfile;
    email: string;
    systemRefId?: string;
    id: string;
    username: string;
}

/**
 * extended {@link AppUserReference} with roles, keyValues and groups and activeTeam
 *
 * all it's information will get stored within the jwt-token for example
 */
export interface AppUserToken extends AppUserReference, rest.HasKeyValue {
    setting?: UserSetting;
    identityProvider?: string;
    activeTeam?: AppUserMembership;
    capabilities: string[];
    groups?: AppGroupShort[];
    keyValues?: Record<string, string>;
}

export interface OnlineProfile {
    /**
     * for example: website, linkedIn, pinterest, github, microsoftTeams, slack
     */
    type: string;
    value: string;
}

export interface PhoneNumber {
    /**
     * for example: phone, cellphone, fax, personal, business...
     */
    type: string;
    number: string;
}

export interface UserProfile extends rest.HasFirstAndLastName {
    title?: string;
    gender?: any;
    salutation?: string;
    about?: string;
    phoneNumbers?: PhoneNumber[];
    onlineProfiles?: OnlineProfile[];
    jobTitle?: string;
    country?: string;
    location?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    organization?: string;
}

export interface UserSetting {
    dateTimeFormat?: string;
    currentTimeZone?: string;
    timeFormat?: string;
    dateFormat?: string;
    /**
     * converts locale value or use LocaleContextHolder when not set
     * @return always a locale
     */
    currentLocale: any;
    locale?: string;
}

export type AppTeamRole = "owner" | "member";

export type EmailErrorCodes = "alreadyTaken" | "invalid" | "tooLong";

export type PasswordErrorCodes = "tooShort" | "tooLong" | "insufficientLowercase" | "insufficientUppercase" | "insufficientDigit" | "insufficientSpecial" | "invalidCurrentPassword";

export type TokenErrorCodes = "expired" | "invalid";

export type UsernameErrorCodes = "alreadyTaken" | "tooShort" | "tooLong" | "notAllowedChar";

export type ValidationResponseUnion<T> = UsernameErrorCodes | PasswordErrorCodes | EmailErrorCodes | TokenErrorCodes;
