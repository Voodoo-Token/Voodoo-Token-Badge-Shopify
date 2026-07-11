import { useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigation } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import {
  FONT_PRESETS,
  loadBadgeSettings,
  parseBadgeFormData,
  saveBadgeSettings,
} from "../lib/badge-settings.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { settings } = await loadBadgeSettings(admin);

  return {
    settings,
    fontOptions: Object.entries(FONT_PRESETS).map(([value, preset]) => ({
      value,
      label: preset.label,
    })),
  };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const settings = parseBadgeFormData(formData);

  try {
    await saveBadgeSettings(admin, settings);
    return { ok: true, settings };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not save settings.",
      settings,
    };
  }
};

function CheckboxField({ name, label, checked }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <input type="checkbox" name={name} value="1" defaultChecked={checked} />
      <span>{label}</span>
    </label>
  );
}

function NumberField({ name, label, value, min, max }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem" }}>
      <span>{label}</span>
      <input
        type="number"
        name={name}
        defaultValue={value}
        min={min}
        max={max}
        style={{ maxWidth: "180px" }}
      />
    </label>
  );
}

function SelectField({ name, label, value, options }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem" }}>
      <span>{label}</span>
      <select name={name} defaultValue={value} style={{ maxWidth: "280px" }}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ColorField({ name, label, value }) {
  return (
    <label style={{ display: "grid", gap: "0.35rem" }}>
      <span>{label}</span>
      <input type="color" name={name} defaultValue={value} />
    </label>
  );
}

export default function Index() {
  const { settings, fontOptions } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const shopify = useAppBridge();
  const currentSettings = actionData?.settings ?? settings;
  const isSaving = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.ok) {
      shopify.toast.show("Badge settings saved");
    } else if (actionData?.ok === false) {
      shopify.toast.show(actionData.error || "Could not save settings", { isError: true });
    }
  }, [actionData, shopify]);

  return (
    <s-page heading="Voodoo Token Badge">
      <s-section heading="Enable on your storefront">
        <s-paragraph>
          Configure the badge here, then turn it on in your theme under{" "}
          <strong>Online Store → Themes → Customize → App embeds → Voodoo Token Badge</strong>.
        </s-paragraph>
        <s-paragraph>
          The badge is static (not a link) and always shows{" "}
          <strong>VOODOO TOKEN / ACCEPTED HERE</strong>, matching the WordPress plugin.
        </s-paragraph>
      </s-section>

      <Form method="post">
        <s-stack direction="block" gap="large">
          <s-section heading="Display">
            <s-stack direction="block" gap="base">
              <CheckboxField
                name="enabled"
                label="Show badge on the storefront"
                checked={currentSettings.enabled}
              />
              <SelectField
                name="size"
                label="Button size"
                value={currentSettings.size}
                options={[
                  { value: "small", label: "Small (75%)" },
                  { value: "medium", label: "Medium (100%)" },
                  { value: "large", label: "Large (125%)" },
                  { value: "xlarge", label: "Extra Large (150%)" },
                ]}
              />
              <SelectField
                name="position"
                label="Position"
                value={currentSettings.position}
                options={[
                  { value: "bottom-right", label: "Bottom right" },
                  { value: "bottom-left", label: "Bottom left" },
                  { value: "top-right", label: "Top right" },
                  { value: "top-left", label: "Top left" },
                ]}
              />
              <NumberField
                name="offset_x"
                label="Horizontal edge spacing (px)"
                value={currentSettings.offset_x}
                min={0}
                max={200}
              />
              <NumberField
                name="offset_y"
                label="Vertical edge spacing (px)"
                value={currentSettings.offset_y}
                min={0}
                max={200}
              />
              <CheckboxField
                name="show_on_mobile"
                label="Show the badge on phones and small screens"
                checked={currentSettings.show_on_mobile}
              />
            </s-stack>
          </s-section>

          <s-section heading="Appearance">
            <s-stack direction="block" gap="base">
              <SelectField
                name="font_family"
                label="Font"
                value={currentSettings.font_family}
                options={fontOptions}
              />
              <ColorField
                name="bg_color"
                label="Background color"
                value={currentSettings.bg_color}
              />
              <ColorField
                name="text_color"
                label="Text color"
                value={currentSettings.text_color}
              />
              <CheckboxField
                name="enable_shadow"
                label="Show a shadow around the badge button"
                checked={currentSettings.enable_shadow}
              />
              <CheckboxField
                name="enable_hover_zoom"
                label="Slightly enlarge the badge when hovering over it"
                checked={currentSettings.enable_hover_zoom}
              />
              <NumberField
                name="z_index"
                label="Layer (z-index)"
                value={currentSettings.z_index}
                min={1}
                max={9999999}
              />
            </s-stack>
          </s-section>

          <s-stack direction="inline" gap="base">
            <s-button type="submit" variant="primary" {...(isSaving ? { loading: true } : {})}>
              Save settings
            </s-button>
          </s-stack>
        </s-stack>
      </Form>

      <s-section slot="aside" heading="Badge defaults">
        <s-unordered-list>
          <s-list-item>Bottom-right position</s-list-item>
          <s-list-item>Medium size</s-list-item>
          <s-list-item>Drop shadow off</s-list-item>
          <s-list-item>Hover zoom off</s-list-item>
          <s-list-item>Fixed label text</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Official site">
        <s-paragraph>
          <s-link href="https://voodootoken.com" target="_blank">
            voodootoken.com
          </s-link>
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};