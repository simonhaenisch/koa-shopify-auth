import { Middleware } from 'koa';
import { OAuthStartOptions } from '../types';
import itpHelper from './client/itp-helper';
import css from './client/polaris-css';
import requestStorageAccess from './client/request-storage-access';
import storageAccessHelper from './client/storage-access-helper';
import Error from './errors';

const HEADING = 'This app needs access to your browser data';
const BODY =
	'Your browser is blocking this app from accessing your data. To continue using this app, click Continue, then click Allow if the browser prompts you.';
const ACTION = 'Continue';

export default function createRequestStorageAccess(config: OAuthStartOptions): Middleware {
	return function requestStorage(ctx) {
		const { shop: unsafeShop } = ctx.query;

		if (!unsafeShop) {
			ctx.throw(400, Error.ShopParamMissing);
			return;
		}

		const shop = encodeURIComponent(unsafeShop);

		ctx.body = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    ${css}
  </style>
  <base target="_top">
  <title>Redirecting…</title>

  <script>
    window.apiKey = "${config.apiKey}";
    window.shopOrigin = "https://${shop}";
    ${itpHelper}
    ${storageAccessHelper}
    ${requestStorageAccess(shop, config)}
  </script>
</head>
<body>
  <main id="RequestStorageAccess">
    <div class="Polaris-Page">
      <div class="Polaris-Page__Content">
        <div class="Polaris-Layout">
          <div class="Polaris-Layout__Section">
            <div class="Polaris-Stack Polaris-Stack--vertical">
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Card">
                  <div class="Polaris-Card__Header">
                    <h1 class="Polaris-Heading">${HEADING}</h1>
                  </div>
                  <div class="Polaris-Card__Section">
                    <p>${BODY}</p>
                  </div>
                </div>
              </div>
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Stack Polaris-Stack--distributionTrailing">
                  <div class="Polaris-Stack__Item">
                    <button type="button" class="Polaris-Button Polaris-Button--primary" id="TriggerAllowCookiesPrompt">
                      <span class="Polaris-Button__Content"><span>${ACTION}</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`;
	};
}
