import {
  IdentityProvider,
  ServiceProvider,
  Constants,
  SamlLib,
  IdentityProviderInstance,
  ServiceProviderInstance,
} from 'samlify';

import {
  ATTRIBUTE_AUTHN_CONTEXT_TEMPLATE,
  ATTRIBUTE_STATEMENT_TEMPLATE,
  ATTRIBUTE_TEMPLATE,
  IDENTITY_PROVIDER_TEMPLATE,
  LOGIN_RESPONSE_TEMPLATE,
} from './template';
import { ATTRIBUTES } from './attributes';
import { LoginRequest } from './login';
import {
  IdentityProviderSettings,
  ServiceProviderSettings,
} from 'samlify/src/types';

export class IdentityProviderOcc {
  private idp: IdentityProviderInstance;
  private sp: ServiceProviderInstance;
  constructor(sp: ServiceProviderSettings, idp?: IdentityProviderSettings) {
    this.idp = IdentityProvider(
      Object.assign(
        {
          metadata: IdentityProviderOcc.getIdentityProviderDescriptor(
            idp.signingCert as Buffer,
          ),
          isAssertionEncrypted: false,
          encryptCert: sp.metadata,
          loginResponseTemplate: this.buildTemplate(),
        },
        idp,
      ),
    );

    this.sp = ServiceProvider(sp);

    this.sp.entityMeta.meta.spSSODescriptor.wantAssertionsSigned = 'true';
  }

  public static getIdentityProviderDescriptor(
    publicKey: Buffer,
    encode?: boolean,
  ): string {
    const cer = publicKey
      .toString('utf8')
      .replace(/-+BEGIN CERTIFICATE-+/, '')
      .replace(/-+END CERTIFICATE-+/, '')
      .replace(/\n/g, '');

    const idp = SamlLib.replaceTagsByValue(IDENTITY_PROVIDER_TEMPLATE, {
      certificateX509: cer,
      httpPost: 'https://',
      httpRedirect: 'https://',
      soap: 'https://',
    });
    if (encode) {
      return Buffer.from(idp, 'utf8').toString('base64');
    }
    return idp;
  }

  public async createLoginResponse(login: LoginRequest) {
    if (!login.email) {
      throw new Error('InvalidArgumentException - email invalid');
    }
    const loginReq = Object.assign(
      {
        login: '',
        firstName: '',
        lastName: '',
        siteId: '',
      },
      login,
    );
    return this.idp.createLoginResponse(
      this.sp,
      { extract: { request: { id: 'request_id' } } },
      Constants.wording.binding.post,
      loginReq,
      (template) => this.tagReplacement(template, this.idp, this.sp, loginReq),
    );
  }

  private tagReplacement(
    template: string,
    idp: import('samlify/src/entity-idp').IdentityProvider,
    sp: import('samlify/src/entity-sp').ServiceProvider,
    attr: LoginRequest,
  ) {
    return {
      id: '',
      context: SamlLib.replaceTagsByValue(template, {
        ...this.tagReplacementBase(idp, sp),
        ...this.tagReplacementCustom(attr),
      }),
    };
  }

  private tagReplacementCustom(attr: LoginRequest) {
    return {
      NameID: attr.email,
      ...this.tagReplacementAttributes(attr),
    };
  }

  private tagReplacementBase(
    idp: import('samlify/src/entity-idp').IdentityProvider,
    sp: import('samlify/src/entity-sp').ServiceProvider,
  ) {
    const metadata = {
      idp: idp.entityMeta,
      sp: sp.entityMeta,
    };
    const nowTime = new Date();
    const fiveMinutesLaterTime = new Date(nowTime.getTime());
    fiveMinutesLaterTime.setMinutes(fiveMinutesLaterTime.getMinutes() + 5);
    const fiveMinutesLater = fiveMinutesLaterTime.toISOString();
    const nameIDFormat = 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent';
    return {
      ID: idp.getEntitySetting().generateID(),
      AssertionID: idp.getEntitySetting().generateID(),
      Destination: metadata.sp.getAssertionConsumerService(
        Constants.wording.binding.post,
      ),
      Audience: metadata.sp.getEntityID(),
      EntityID: metadata.sp.getEntityID(),
      SubjectRecipient: metadata.sp.getAssertionConsumerService(
        Constants.wording.binding.post,
      ),
      Issuer: metadata.idp.getEntityID(),
      IssueInstant: nowTime.toISOString(),
      AssertionConsumerServiceURL: metadata.sp.getAssertionConsumerService(
        Constants.wording.binding.post,
      ),
      StatusCode: Constants.StatusCode.Success,
      // can be customized
      ConditionsNotBefore: nowTime.toISOString(),
      ConditionsNotOnOrAfter: fiveMinutesLater,
      SubjectConfirmationDataNotOnOrAfter: fiveMinutesLater,
      NameIDFormat: nameIDFormat,
      AuthnStatement: ATTRIBUTE_AUTHN_CONTEXT_TEMPLATE,
    };
  }

  private tagReplacementAttributes(attr: { [key: string]: any }) {
    const preAttr = {};
    Object.keys(attr).forEach(
      (k) =>
        (preAttr['attr' + k.replace(/(.)/, (l) => l.toUpperCase())] = attr[k]),
    );
    return preAttr;
  }

  private buildTemplate(): import('samlify/src/libsaml').LoginResponseTemplate {
    return {
      context: LOGIN_RESPONSE_TEMPLATE,
      additionalTemplates: {
        attributeStatementTemplate: {
          context: ATTRIBUTE_STATEMENT_TEMPLATE,
        },
        attributeTemplate: {
          context: ATTRIBUTE_TEMPLATE,
        },
      },
      attributes: ATTRIBUTES,
    };
  }
}
