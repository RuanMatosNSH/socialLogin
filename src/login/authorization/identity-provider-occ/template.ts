export const ATTRIBUTE_AUTHN_CONTEXT_TEMPLATE = `<saml:AuthnContext>
    <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>
</saml:AuthnContext>`;

export const ATTRIBUTE_STATEMENT_TEMPLATE = `<saml:AttributeStatement xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">{Attributes}
</saml:AttributeStatement>`;

export const ATTRIBUTE_TEMPLATE = `
<saml:Attribute Name="{Name}" NameFormat="{NameFormat}">
    <saml:AttributeValue xsi:type="{ValueXsiType}">{Value}</saml:AttributeValue>
</saml:Attribute>`;

export const LOGIN_RESPONSE_TEMPLATE = `<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="{ID}" Version="2.0"
    IssueInstant="{IssueInstant}" Destination="{Destination}">
    <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">{Issuer}</saml:Issuer>
    <samlp:Status>
        <samlp:StatusCode Value="{StatusCode}" />
    </samlp:Status>
    <saml:Assertion xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="{AssertionID}"
        Version="2.0"
        IssueInstant="{IssueInstant}">
        <saml:Issuer>{Issuer}</saml:Issuer>
        <saml:Subject>
            <saml:NameID Format="{NameIDFormat}">{NameID}</saml:NameID>
            <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
                <saml:SubjectConfirmationData NotOnOrAfter="{SubjectConfirmationDataNotOnOrAfter}"
                    Recipient="{SubjectRecipient}" />
            </saml:SubjectConfirmation>
        </saml:Subject>
        <saml:Conditions
            NotBefore="{ConditionsNotBefore}" NotOnOrAfter="{ConditionsNotOnOrAfter}">
            <saml:AudienceRestriction>
                <saml:Audience>{Audience}</saml:Audience>
            </saml:AudienceRestriction>
        </saml:Conditions>
        {AttributeStatement}
        <saml:AuthnStatement AuthnInstant="{IssueInstant}">
        {AuthnStatement}
        </saml:AuthnStatement>
    </saml:Assertion>
</samlp:Response>`;

export const IDENTITY_PROVIDER_TEMPLATE = `<EntityDescriptor entityID="social-login" xmlns="urn:oasis:names:tc:SAML:2.0:metadata">
<IDPSSODescriptor xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
    protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
        <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
            <ds:X509Data>
                <ds:X509Certificate>{certificateX509}</ds:X509Certificate>
            </ds:X509Data>
        </ds:KeyInfo>
    </KeyDescriptor>
    <NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</NameIDFormat>
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
        Location="{httpRedirect}" />
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
        Location="{httpPost}" />
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:SOAP"
        Location="{soap}" />
</IDPSSODescriptor>
</EntityDescriptor>`;
