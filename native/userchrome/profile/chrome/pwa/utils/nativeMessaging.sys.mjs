import { ExtensionCommon } from 'resource://gre/modules/ExtensionCommon.sys.mjs';
import { NativeApp } from 'resource://gre/modules/NativeMessaging.sys.mjs';

const extensionId = 'firefoxpwa@filips.si';
const nativeAppId = 'firefoxpwa';
const contextName = `UserChrome/${extensionId}/sendNativeMessage/${nativeAppId}`;

/**
 * A custom extension context that "emulates" our main extension.
 */
class UserChromeContext extends ExtensionCommon.BaseContext {
  constructor () {
    super('userChromeEnv', { id: extensionId, manifestVersion: 2 });
    this.sandbox = Cu.Sandbox(globalThis);
  }

  logActivity (type, name, data) {
    console.log('[UserChromeContext]', type, name, data);
  }

  get cloneScope () {
    return this.sandbox;
  }

  get principal () {
    return Cu.getObjectPrincipal(this.sandbox);
  }
}
/**
 * Send a message to the native program and return response.
 *
 * @param {Object} message - The message to send
 *
 * @returns {Promise<Object>} The response from the native program
 * @throws {Error} If sending the message failed
 */
export function sendNativeMessage(message) {
  const userChromeContext = new UserChromeContext();
  const nativeMessage = NativeApp.encodeMessage(userChromeContext, message);
  const nativeApp = new NativeApp(userChromeContext, nativeAppId);
  return nativeApp.sendMessage(new StructuredCloneHolder(contextName, null, nativeMessage));
}
