export const BADGE_METAFIELD_NAMESPACE = "$app";
export const BADGE_METAFIELD_KEY = "badge_settings";

export const DEFAULT_BADGE_SETTINGS = {
  enabled: true,
  size: "medium",
  position: "bottom-right",
  offset_x: 20,
  offset_y: 20,
  bg_color: "#0c3c4c",
  text_color: "#ffffff",
  font_family: "arial",
  enable_shadow: false,
  enable_hover_zoom: false,
  show_on_mobile: true,
  z_index: 999999,
};

export const SIZE_PRESETS = {
  small: 0.75,
  medium: 1.0,
  large: 1.25,
  xlarge: 1.5,
};

export const FONT_PRESETS = {
  arial: { label: "Arial", family: "Arial, Helvetica, sans-serif", google: false },
  helvetica: { label: "Helvetica", family: "Helvetica, Arial, sans-serif", google: false },
  georgia: { label: "Georgia", family: 'Georgia, "Times New Roman", serif', google: false },
  times: { label: "Times New Roman", family: '"Times New Roman", Times, serif', google: false },
  verdana: { label: "Verdana", family: "Verdana, Geneva, sans-serif", google: false },
  tahoma: { label: "Tahoma", family: "Tahoma, Geneva, sans-serif", google: false },
  trebuchet: { label: "Trebuchet MS", family: '"Trebuchet MS", Helvetica, sans-serif', google: false },
  system: {
    label: "System UI",
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    google: false,
  },
  roboto: { label: "Roboto", family: '"Roboto", sans-serif', google: "Roboto:wght@400;700" },
  "open-sans": { label: "Open Sans", family: '"Open Sans", sans-serif', google: "Open+Sans:wght@400;700" },
  montserrat: { label: "Montserrat", family: '"Montserrat", sans-serif', google: "Montserrat:wght@400;700" },
  poppins: { label: "Poppins", family: '"Poppins", sans-serif', google: "Poppins:wght@400;700" },
  lato: { label: "Lato", family: '"Lato", sans-serif', google: "Lato:wght@400;700" },
  oswald: { label: "Oswald", family: '"Oswald", sans-serif', google: "Oswald:wght@400;700" },
  raleway: { label: "Raleway", family: '"Raleway", sans-serif', google: "Raleway:wght@400;700" },
  ubuntu: { label: "Ubuntu", family: '"Ubuntu", sans-serif', google: "Ubuntu:wght@400;700" },
};

const ALLOWED_SIZES = new Set(Object.keys(SIZE_PRESETS));
const ALLOWED_POSITIONS = new Set(["bottom-right", "bottom-left", "top-right", "top-left"]);
const ALLOWED_FONTS = new Set(Object.keys(FONT_PRESETS));

export function sanitizeBadgeSettings(input) {
  const source = input && typeof input === "object" ? input : {};
  const next = { ...DEFAULT_BADGE_SETTINGS };

  next.enabled = parseCheckbox(source.enabled, DEFAULT_BADGE_SETTINGS.enabled);
  next.size = ALLOWED_SIZES.has(source.size) ? source.size : DEFAULT_BADGE_SETTINGS.size;
  next.position = ALLOWED_POSITIONS.has(source.position)
    ? source.position
    : DEFAULT_BADGE_SETTINGS.position;
  next.offset_x = clampInt(source.offset_x, 0, 200, DEFAULT_BADGE_SETTINGS.offset_x);
  next.offset_y = clampInt(source.offset_y, 0, 200, DEFAULT_BADGE_SETTINGS.offset_y);
  next.bg_color = sanitizeColor(source.bg_color, DEFAULT_BADGE_SETTINGS.bg_color);
  next.text_color = sanitizeColor(source.text_color, DEFAULT_BADGE_SETTINGS.text_color);
  next.font_family = ALLOWED_FONTS.has(source.font_family)
    ? source.font_family
    : DEFAULT_BADGE_SETTINGS.font_family;
  next.enable_shadow = parseCheckbox(source.enable_shadow, DEFAULT_BADGE_SETTINGS.enable_shadow);
  next.enable_hover_zoom = parseCheckbox(
    source.enable_hover_zoom,
    DEFAULT_BADGE_SETTINGS.enable_hover_zoom,
  );
  next.show_on_mobile = parseCheckbox(source.show_on_mobile, DEFAULT_BADGE_SETTINGS.show_on_mobile);
  next.z_index = clampInt(source.z_index, 1, 9999999, DEFAULT_BADGE_SETTINGS.z_index);

  return next;
}

function parseCheckbox(value, fallback) {
  if (value === true || value === "true" || value === "1" || value === 1 || value === "on") {
    return true;
  }
  if (value === false || value === "false" || value === "0" || value === 0 || value === "off") {
    return false;
  }
  return fallback;
}

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function sanitizeColor(value, fallback) {
  const color = String(value ?? "").trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color) ? color : fallback;
}

export async function loadBadgeSettings(admin) {
  const response = await admin.graphql(
    `#graphql
      query VoodooBadgeSettings {
        shop {
          id
          badgeSettings: metafield(namespace: "${BADGE_METAFIELD_NAMESPACE}", key: "${BADGE_METAFIELD_KEY}") {
            value
          }
        }
      }`,
  );

  const json = await response.json();
  const shop = json?.data?.shop;
  const raw = shop?.badgeSettings?.value;

  if (!raw) {
    return { shopId: shop?.id ?? null, settings: { ...DEFAULT_BADGE_SETTINGS } };
  }

  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return { shopId: shop?.id ?? null, settings: sanitizeBadgeSettings(parsed) };
  } catch {
    return { shopId: shop?.id ?? null, settings: { ...DEFAULT_BADGE_SETTINGS } };
  }
}

export async function saveBadgeSettings(admin, settings) {
  const sanitized = sanitizeBadgeSettings(settings);
  const { shopId } = await loadBadgeSettings(admin);

  if (!shopId) {
    throw new Error("Shop ID unavailable.");
  }

  const response = await admin.graphql(
    `#graphql
      mutation VoodooBadgeSettingsSave($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
          }
          userErrors {
            field
            message
          }
        }
      }`,
    {
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace: BADGE_METAFIELD_NAMESPACE,
            key: BADGE_METAFIELD_KEY,
            type: "json",
            value: JSON.stringify(sanitized),
          },
        ],
      },
    },
  );

  const json = await response.json();
  const userErrors = json?.data?.metafieldsSet?.userErrors ?? [];

  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(" "));
  }

  return sanitized;
}

export function parseBadgeFormData(formData) {
  return sanitizeBadgeSettings({
    enabled: formData.has("enabled"),
    size: formData.get("size"),
    position: formData.get("position"),
    offset_x: formData.get("offset_x"),
    offset_y: formData.get("offset_y"),
    bg_color: formData.get("bg_color"),
    text_color: formData.get("text_color"),
    font_family: formData.get("font_family"),
    enable_shadow: formData.has("enable_shadow"),
    enable_hover_zoom: formData.has("enable_hover_zoom"),
    show_on_mobile: formData.has("show_on_mobile"),
    z_index: formData.get("z_index"),
  });
}