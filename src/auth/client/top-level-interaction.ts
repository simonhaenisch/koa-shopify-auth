import { OAuthStartOptions } from '../../types';
import { joinPathSegments } from '../../utils';

// Copied from https://github.com/Shopify/shopify_app
const topLevelInteraction = (shop: string, { prefix = '' }: OAuthStartOptions) => {
	return `(function() {
      function setUpTopLevelInteraction() {
        var TopLevelInteraction = new ITPHelper({
          redirectUrl: "${joinPathSegments(prefix, `auth?shop=${shop}`)}",
        });

        TopLevelInteraction.execute();
      }

      document.addEventListener("DOMContentLoaded", setUpTopLevelInteraction);
    })();`;
};

export default topLevelInteraction;
