const createA11ySdk = ({ a11yProperty }) => (api) => {
  const { props, setProps } = api;
  return {
    accessibility: {
      get ariaLabel() {
        var _a;
        return (_a = props[a11yProperty]) == null ? void 0 : _a.ariaLabel;
      },
      set ariaLabel(value) {
        const existingA11y = props[a11yProperty] ?? {};
        setProps({ [a11yProperty]: { ...existingA11y, ariaLabel: value } });
      }
    }
  };
};
function isNumber$1(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isString$1(value) {
  return typeof value === "string";
}
function isDate$1(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
function isArray$1(value) {
  return Array.isArray(value);
}
function isObject$1(value) {
  return typeof value === "object" && value !== null && !isArray$1(value);
}
function isNil$1(value) {
  return value === null || value === void 0;
}
const sanitizeItem = (item) => Object.entries(item).reduce((acc, [key, value]) => {
  if (isNil$1(value)) {
    return acc;
  } else if (!isDate$1(value)) {
    if (isObject$1(value)) {
      return {
        ...acc,
        [key]: sanitizeItem(value)
      };
    } else if (isArray$1(value)) {
      return {
        ...acc,
        [key]: value.map(sanitizeItem)
      };
    }
  }
  return { ...acc, [key]: value };
}, {});
const transformPropDataToSdkData = (menuDataItem) => {
  var _a, _b, _c;
  return sanitizeItem({
    label: menuDataItem.label,
    link: (_a = menuDataItem.link) == null ? void 0 : _a.href,
    selected: menuDataItem.selected,
    target: (_b = menuDataItem.link) == null ? void 0 : _b.target,
    id: menuDataItem._id,
    menuItems: (_c = menuDataItem.items) == null ? void 0 : _c.map(transformPropDataToSdkData)
  });
};
const transformSdkDataToPropData = (sdkMenuItem) => {
  var _a;
  return sanitizeItem({
    label: sdkMenuItem.label || "",
    link: {
      href: sdkMenuItem.link,
      target: sdkMenuItem.target
    },
    isVisible: true,
    isVisibleMobile: true,
    selected: sdkMenuItem.selected,
    _id: sdkMenuItem.id,
    items: (_a = sdkMenuItem.menuItems) == null ? void 0 : _a.map(transformSdkDataToPropData)
  });
};
function isNumber(value) {
  return typeof value === "number" && !Number.isNaN(value);
}
function isString(value) {
  return typeof value === "string";
}
function isBoolean(value) {
  return value === true || value === false;
}
function isDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
function isFunction(value) {
  return typeof value === "function";
}
function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return typeof value === "object" && value !== null && !isArray(value);
}
function isInteger(value) {
  return Number.isInteger(value);
}
function isNil(value) {
  return value === null || value === void 0;
}
function isIn(value, arr) {
  return arr.includes(value);
}
function isAbove(value, limit) {
  return value > limit;
}
function isBelow(value, limit) {
  return value < limit;
}
const templates$1 = {
  /* prettier-ignore */
  warning_not_null: ({ propertyName, functionName }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to null.`,
  /* prettier-ignore */
  warning_non_images_in_gallery: ({ galleryId }) => `Gallery "${galleryId}" cannot contain items that are not images. To also display video and text, choose a gallery that supports those types.`,
  /* prettier-ignore */
  warning_invalid_effect_name: ({ propertyName, compName, effectName, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it is an invalid effectName value. Read more about effects: "${infoLink}"')`,
  /* prettier-ignore */
  warning_invalid_effect_option: ({ propertyName, compName, effectName, effectOption, effectOptionRef }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it was called with the following invalid effectOptions keys: ${effectOption}. Read more about the effectOptions object: "https://www.wix.com/code/reference/$w.EffectOptions.html#${effectOptionRef}"`,
  /* prettier-ignore */
  warning_effect_options_not_set: ({ propertyName, compName, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the specified effect options because it was called without an effect. Read more about effects: "${infoLink}"')`,
  /* prettier-ignore */
  warning_invalid_effect_options: ({ propertyName, compName, effectName, wrongProperty, wrongValue, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it was called with the following invalid effectOptions ${wrongProperty}: ${wrongValue}. Read more about the effectOptions object: "${infoLink}"')`,
  /* prettier-ignore */
  warning_deprecated_effect_name: ({ propertyName, compName, effectName, infoLink }) => `The "${propertyName}" function  called on "${compName}" was called with the following deprecated effect: "${effectName}". Read more about effects: "${infoLink}"')`,
  /* prettier-ignore */
  warning_deprecated_effect_with_options: ({ propertyName, compName, effectName, infoLink }) => `The "${propertyName}" function  called on "${compName}" was executed without the specified effect options because it was called with the following deprecated effect: "${effectName}". Read more about effects: "${infoLink}"`,
  /* prettier-ignore */
  warning_invalid_type_effect_options: ({ propertyName, compName, effectName, wrongValue, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because the it was called with the following invalid effectOptions "${wrongValue}". The effectOptions must be of type Object. Read more about the effectOptions object: "${infoLink}"'`,
  /* prettier-ignore */
  error_bad_image_format_with_index: ({ propertyName, wrongValue, index }) => `The "${propertyName}" property of the item at index ${index} cannot be set to "${wrongValue}". It must be a valid URL starting with "http://", "https://", or "wix:image://".`,
  /* prettier-ignore */
  error_invalid_type_for_file_limit: ({ propertyName }) => `The ${propertyName} property is not yet supported for Document or Audio file types.`,
  /* prettier-ignore */
  warning_not_null_for_comp_name: ({ propertyName, functionName, compName }) => `The ${propertyName} parameter of "${compName}" that is passed to the ${functionName} method cannot be set to null.`,
  /* prettier-ignore */
  warning_not_null_with_index: ({ propertyName, functionName, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to null or undefined.`,
  /* prettier-ignore */
  warning_invalid_option: ({ propertyName, wrongValue, index }) => `The ${propertyName} parameter at index ${index} that is passed to the options function cannot be set to ${JSON.stringify(wrongValue)}. Options must contain either a non-null value or a non-null label.`,
  /* prettier-ignore */
  warning_duplicates_found: ({ propertyName, duplicateOptions }) => `The ${propertyName} parameter provided to the options function includes duplicate options. To avoid confusion, these duplicates have been automatically removed: ${JSON.stringify(duplicateOptions)}.`,
  /* prettier-ignore */
  warning_duplicates_values_found: ({ propertyName, duplicateOptions }) => `The ${propertyName} parameter provided to the options function includes duplicate options. Please remove the duplicates: ${JSON.stringify(duplicateOptions)}.`,
  /* prettier-ignore */
  warning_invalid_option_value: ({ propertyName, wrongValue, functionName }) => `The ${propertyName} parameter that is passed to the ${functionName} cannot be set to ${JSON.stringify(wrongValue)}. Ensure that the value is one of the available options in the array.`,
  /* prettier-ignore */
  warning_color_casting_performed: ({ propertyName, compName, infoLink }) => ` The value of "${propertyName}" property of "${compName}" expects an rgbColor value, but was set to an rgbaColor value. The color value has been set, but the alpha opacity information has been ignored. Read more about rgbColor values: "${infoLink}"`,
  /* prettier-ignore */
  warning_value_changed: ({ propertyName, compName, newValue, changedProperty }) => `The ${propertyName} of ${compName} was set to ${newValue}, which is less than ${compName}'s ${changedProperty} value. ${compName} cannot have a ${changedProperty} value which is greater than its ${propertyName} value. The value of ${changedProperty} has therefore been set to ${newValue}.`,
  /* prettier-ignore */
  warning_at_least: ({ propertyName, wrongValue, minValue }) => `The value of ${propertyName} property should not be set to the value ${wrongValue}. It should be at least ${minValue}.`,
  /* prettier-ignore */
  warning_at_most: ({ propertyName, wrongValue, maxValue }) => `The value of ${propertyName} property should not be set to the value ${wrongValue}. It should be at most ${maxValue}.`,
  /* prettier-ignore */
  error_mandatory_val: ({ propertyName, functionName }) => `The ${propertyName} parameter is required for ${functionName} method.`,
  /* prettier-ignore */
  error_mandatory_multiple_vals: ({ propertyNames, functionName }) => `The following parameters: ${[...propertyNames]}, are required for ${functionName} method.`,
  /* prettier-ignore */
  error_mandatory_val_with_index: ({ propertyName, functionName, index }) => `The ${propertyName} parameter of item at index ${index} is required for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_val: ({ propertyName, functionName }) => `The ${propertyName} parameter is not allowed for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_multiple_vals: ({ propertyNames, functionName }) => `The following parameters: ${[...propertyNames]} are unknown for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_val_with_index: ({ propertyName, functionName, index }) => `The ${propertyName} parameter of item at index ${index} is not allowed for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_multiple_vals_with_index: ({ propertyNames, functionName, index }) => `The following parameters: ${[...propertyNames]} of item at index ${index} are unknown for ${functionName} method.`,
  /* prettier-ignore */
  error_length_in_range: ({ propertyName, functionName, value, minimum, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_length_in_range_with_index: ({ propertyName, functionName, value, minimum, maximum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_length_accept_single_value: ({ propertyName, functionName, value, expectedValue }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be ${expectedValue}.`,
  /* prettier-ignore */
  error_length_accept_single_value_with_index: ({ propertyName, functionName, value, expectedValue, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be ${expectedValue}.`,
  /* prettier-ignore */
  error_length_less_than: ({ propertyName, functionName, value, minimum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}" because its length is shorter than ${minimum}.`,
  /* prettier-ignore */
  error_length_less_than_with_index: ({ propertyName, functionName, value, minimum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}" because its length is shorter than ${minimum}.`,
  /* prettier-ignore */
  error_length_exceeds: ({ propertyName, functionName, value, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}" because its length exceeds ${maximum}.`,
  /* prettier-ignore */
  error_length_exceeds_with_index: ({ propertyName, functionName, value, maximum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}" because its length exceeds ${maximum}.`,
  /* prettier-ignore */
  error_range: ({ propertyName, functionName, value, minimum, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". It must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_range_with_index: ({ propertyName, functionName, value, minimum, maximum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". It must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_accept_single_value: ({ propertyName, functionName, value, expectedValue }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". It must be ${expectedValue}.`,
  /* prettier-ignore */
  error_accept_single_value_with_index: ({ propertyName, functionName, value, expectedValue, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". It must be ${expectedValue}.`,
  /* prettier-ignore */
  error_larger_than: ({ propertyName, functionName, value, minimum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be larger than ${minimum}.`,
  /* prettier-ignore */
  error_at_least: ({ propertyName, functionName, value, minimum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be at least ${minimum}.`,
  /* prettier-ignore */
  error_larger_than_with_index: ({ propertyName, functionName, value, minimum, index }) => `The value of ${propertyName} parameter of item at ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be larger than ${minimum}.`,
  /* prettier-ignore */
  error_less_than: ({ propertyName, functionName, value, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be less than ${maximum}.`,
  /* prettier-ignore */
  error_less_than_with_index: ({ propertyName, functionName, value, maximum, index }) => `The value of ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be less than ${maximum}.`,
  /* prettier-ignore */
  error_type: ({ propertyName, functionName, value, expectedType }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be of type ${expectedType}.`,
  /* prettier-ignore */
  error_type_with_index: ({ propertyName, functionName, value, expectedType, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be of type ${expectedType}.`,
  /* prettier-ignore */
  error_bad_format: ({ propertyName, functionName, value }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. Bad format`,
  /* prettier-ignore */
  error_effects_input: ({ functionName, wrongEffects, allowedEffects }) => `Passed  effects: "${wrongEffects.join('", "')}" to the ${functionName} method are wrong for this element. Allowed effects are: "${allowedEffects.join('", "')}".`,
  /* prettier-ignore */
  error_slide_input: ({ propertyName, functionName, slideShowId, value, minimum, maximum }) => `The "${propertyName}" parameter that is passed to the "${functionName}" method cannot be set to the value ${value}. It must be a slide from the "${slideShowId}" slideshow or an index between ${minimum} and ${maximum}`,
  /* prettier-ignore */
  error_state_input: ({ propertyName, functionName, stateBoxId, value }) => `The "${propertyName}" parameter that is passed to the "${functionName}" method cannot be set to the value ${value}. It must be a state from the "${stateBoxId}" statebox`,
  /* prettier-ignore */
  error_bad_format_with_index: ({ propertyName, functionName, value, index }) => `The "${propertyName}" property of the item at index ${index} that is passed to the ${functionName} method cannot be set to "${value}". Bad format`,
  /* prettier-ignore */
  error_bad_format_with_hint: ({ propertyName, functionName, wrongValue, hint }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. Bad format, must be ${hint} format.`,
  /* prettier-ignore */
  error_object_bad_format: ({ keyName, propertyName, functionName, wrongValue, message }) => `The value of ${keyName} in ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. ${message}`,
  /* prettier-ignore */
  error_object_bad_format_with_index: ({ keyName, propertyName, index, functionName, wrongValue, message }) => `The value of ${keyName} of item at index ${index} in ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. ${message}`,
  /* prettier-ignore */
  error_bad_svg_format: ({ propertyName, value }) => `The "${propertyName}" property cannot be set to "${value}". It must be a valid SVG XML string or an SVG source starting with "http://", "https://", or "wix:vector://v1/".`,
  /* prettier-ignore */
  error_target_w_photo: ({ target }) => `The target parameter that is passed to the target method cannot be set to the value ${target}. It must be of type from (_blank,_self).`,
  /* prettier-ignore */
  error_invalid_rel: ({ rel, validKeywords }) => `The rel parameter that is passed to the rel method cannot be set to the value ${rel}. It must be a space-separated list of unique keywords (${validKeywords.join()}).`,
  /* prettier-ignore */
  error_menu_items_target: ({ target, label, index }) => `The target parameter of the item with the label ${label} nested under the item at index ${index} that is passed to the target method cannot be set to the value ${target}. It must be of type from (_blank, _self).`,
  /* prettier-ignore */
  error_menu_items_id_pattern: ({ id, label, index }) => `The id parameter of the item with the label ${label} nested under the item at index ${index} that is passed to the id method cannot be set to the value ${id}. It must consist of letters, numbers, or dashes.`,
  /* prettier-ignore */
  error_menu_items_id_uniqueness: ({ id }) => `The menuItems parameter that is passed to the menuItems method cannot be set to the given value, as the id value ${id} already exists. Each menu item id must be unique.`,
  /* prettier-ignore */
  error_menu_items_depth: ({ labelValue, maxLevels }) => `The menuItems parameter with the label "${labelValue}" that is passed to the menuItems method cannot be nested at this level. Menus can be ${maxLevels} levels deep.`,
  /* prettier-ignore */
  error_menu_items_label: ({ index }) => `The value of the label parameter of the item at index ${index} that is passed to the label cannot be set to the value undefined, null, or an empty string, unless a label can be inferred from the item link's page title.`,
  /* prettier-ignore */
  error_bad_menu_item_format: ({ propertyName, value }) => `The "${propertyName}" property cannot be set to "${value}". It must be a valid URL starting with "http://", "https://", "image://", "wix:image://v1" or "wix:vector://v1/svgshape.v2".`,
  /* prettier-ignore */
  error_bad_menu_item_format_with_index: ({ propertyName, value, index }) => `The "${propertyName}" property of the item at index ${index} cannot be set to "${value}". It must be a valid URL starting with "http://", "https://", "image://", "wix:image://v1" or "wix:vector://v1/svgshape.v2"`,
  /* prettier-ignore */
  error_invalid_css_value: ({ propertyName, compName, cssProperty, exampleFormat, infoLink }) => ` The "${propertyName}" property of "${compName}" was set to an invalid "${cssProperty}" value. The value is expected in the following format:"${exampleFormat}". Read more about "${cssProperty}" values: "${infoLink}"`,
  /* prettier-ignore */
  error_invalid_css_value_multiple_expected_formats: ({ propertyName, compName, cssProperty, exampleFormats, infoLink }) => ` The "${propertyName}" property of "${compName}" was set to an invalid "${cssProperty}" value. The value is expected in one of the following formats:"${exampleFormats}". Read more about "${cssProperty}" values: "${infoLink}"`,
  /* prettier-ignore */
  error_invalid_location: ({ propertyName, index, wrongValue }) => `The ${propertyName} parameter at index ${index} that is passed to the markers function cannot be set to ${wrongValue}. You need to set either location object {longitude, latitude}, or a valid address - placeId.`,
  /* prettier-ignore */
  error_invalid_markers: ({ wrongValue }) => `The markers property cannot be set to ${wrongValue}. You need to set at least one marker in the array.`,
  /* prettier-ignore */
  error_only_getter: ({ propertyName, compType }) => `Cannot set property ${propertyName} of ${compType} which has only a getter.`,
  /* prettier-ignore */
  error_invalid_url: ({ url, type, prefix }) => `The "src" property cannot be set to "${url}". It must be a valid URL starting with "http://", "https://", or a valid ${type} URL starting with ${prefix}.`,
  /* prettier-ignore */
  error_supported_link_type_with_index: ({ functionName, wrongValue, index }) => `The link property of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${wrongValue}" as this is not a supported link type.`,
  /* prettier-ignore */
  error_invalid_target_with_index: ({ functionName, wrongValue, index }) => `The target parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. It must be of type from (_blank,_self).`,
  /* prettier-ignore */
  warning_unsupported_function_for_type: ({ functionName, type }) => `'${functionName}' is not supported for an element of type: ${type}.`,
  /* prettier-ignore */
  error_bad_iana_timezone: ({ timeZoneIANA }) => `Invalid IANA time zone specified: "${timeZoneIANA}"`,
  /* prettier-ignore */
  error_invalid_option_fields: ({ propertyName, wrongValue, fields, index }) => `The ${propertyName} at index ${index} cannot be set to ${JSON.stringify(wrongValue)}. Options must contain at least a non-null ${fields[0]} or a non-null ${fields[1]}.`,
  /* prettier-ignore */
  error_item_external_link: ({ propertyName, functionName, index }) => `The ${propertyName} of the ${functionName} parameter of item at index ${index} that is passed to the items method cannot be an external link. It must be a link to a page on your site.`,
  /* prettier-ignore */
  error_unsupported_property_with_hint: ({ propertyName, hint }) => `The ${propertyName} parameter cannot be set when ${hint}`,
  /* prettier-ignore */
  error_item_not_found: ({ propertyName, functionName, value }) => `The ${propertyName} parameter with value ${value} that is passed to the ${functionName} method is not found.`,
  /* prettier-ignore */
  error_array_length: ({ propertyName, functionName, value, arrayLength }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. Its length must be at least ${arrayLength}.`,
  /* prettier-ignore */
  error_unsupported_chars: ({ propertyName, functionName }) => `The ${propertyName} parameter that is passed to the ${functionName} method contains invalid characters.`,
  /* prettier-ignore */
  error_values_not_unique: ({ propertyName, functionName, wrongValue }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to ${JSON.stringify(wrongValue)}. Options must contain unique value properties.`,
  /* prettier-ignore */
  error_invalid_indice_value: ({ propertyName, invalidValue }) => `The ${propertyName} parameter cannot be set to ${JSON.stringify(invalidValue)}. Ensure that the options array contains at least one option before applying ${propertyName}.`,
  /* prettier-ignore */
  error_none_value_unavailable: ({ propertyName, functionName, value }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to ${value} value. Add none item to the ${functionName} list, or set ${propertyName} to existing value`,
  /* prettier-ignore */
  warning_item_value_not_found: ({ propertyName, functionName, value }) => `The ${propertyName} parameter with value ${value} that is passed to the ${functionName} method is not found.`,
  /* prettier-ignore */
  error_bad_link_format: ({ url, propertyName }) => `The ${propertyName} property that is passed to the ${propertyName} method cannot be set to the value "${url}" as this is not a supported link type.`,
  /* prettier-ignore */
  warning_icon_not_animated: ({ propertyName }) => `The animated icon is not set in the settings panel, so the ${propertyName} method will not have any effect.`
};
const nilAssignmentMessage$1 = ({ compName, functionName, propertyName, index }) => {
  if (isNumber(index)) {
    return templates$1.warning_not_null_with_index({
      propertyName,
      functionName,
      index
    });
  }
  if (compName) {
    return templates$1.warning_not_null_for_comp_name({
      compName,
      functionName,
      propertyName
    });
  }
  return templates$1.warning_not_null({ functionName, propertyName });
};
const missingFieldMessage = ({ functionName, propertyName, index }) => {
  return isNumber(index) ? templates$1.error_mandatory_val_with_index({
    functionName,
    propertyName,
    index
  }) : templates$1.error_mandatory_val({ functionName, propertyName });
};
const unknownFieldMessage = ({ functionName, propertyNames, index }) => {
  if (propertyNames && propertyNames.length > 1) {
    return isNumber(index) ? templates$1.error_unknown_multiple_vals_with_index({
      functionName,
      propertyNames,
      index
    }) : templates$1.error_unknown_multiple_vals({ functionName, propertyNames });
  }
  return isNumber(index) ? templates$1.error_unknown_val_with_index({
    functionName,
    propertyName: propertyNames[0],
    index
  }) : templates$1.error_unknown_val({
    functionName,
    propertyName: propertyNames[0]
  });
};
const invalidStringLengthMessage = ({ functionName, propertyName, value, maximum, minimum, index }) => {
  if (minimum && maximum) {
    if (minimum === maximum) {
      return isNumber(index) ? templates$1.error_length_accept_single_value_with_index({
        functionName,
        propertyName,
        value,
        expectedValue: minimum,
        index
      }) : templates$1.error_length_accept_single_value({
        functionName,
        propertyName,
        value,
        expectedValue: minimum
      });
    }
    return isNumber(index) ? templates$1.error_length_in_range_with_index({
      functionName,
      propertyName,
      value,
      maximum,
      minimum,
      index
    }) : templates$1.error_length_in_range({
      functionName,
      propertyName,
      value,
      maximum,
      minimum
    });
  }
  if (!minimum && maximum) {
    return isNumber(index) ? templates$1.error_length_exceeds_with_index({
      functionName,
      propertyName,
      value,
      maximum,
      index
    }) : templates$1.error_length_exceeds({
      functionName,
      propertyName,
      value,
      maximum
    });
  }
  return isNumber(index) ? templates$1.error_length_less_than_with_index({
    functionName,
    propertyName,
    value,
    minimum,
    index
  }) : templates$1.error_length_less_than({
    functionName,
    propertyName,
    value,
    minimum
  });
};
const invalidNumberBoundsMessage = ({ functionName, propertyName, value, minimum, maximum, index }) => {
  if (minimum && maximum) {
    if (minimum === maximum) {
      return isNumber(index) ? templates$1.error_accept_single_value_with_index({
        functionName,
        propertyName,
        expectedValue: minimum,
        value,
        index
      }) : templates$1.error_accept_single_value({
        functionName,
        propertyName,
        expectedValue: minimum,
        value
      });
    }
    return isNumber(index) ? templates$1.error_range_with_index({
      functionName,
      propertyName,
      value,
      maximum,
      minimum,
      index
    }) : templates$1.error_range({
      functionName,
      propertyName,
      value,
      maximum,
      minimum
    });
  }
  if (!minimum && maximum) {
    return isNumber(index) ? templates$1.error_less_than_with_index({
      functionName,
      propertyName,
      maximum,
      value,
      index
    }) : templates$1.error_less_than({
      functionName,
      propertyName,
      maximum,
      value
    });
  }
  return isNumber(index) ? templates$1.error_larger_than_with_index({
    functionName,
    propertyName,
    value,
    minimum,
    index
  }) : templates$1.error_larger_than({
    functionName,
    propertyName,
    value,
    // TS should know that minimum can't be undefined here
    minimum
  });
};
const invalidTypeMessage = ({ functionName, propertyName, types, value, index }) => {
  const expectedType = types.map((type) => type === "nil" ? "null" : type).join(",");
  return isNumber(index) ? templates$1.error_type_with_index({
    functionName,
    index,
    propertyName,
    value,
    expectedType
  }) : templates$1.error_type({
    functionName,
    propertyName,
    value,
    expectedType
  });
};
const invalidEnumValueMessage = ({ functionName, propertyName, value, enum: enumArray, index }) => {
  const expectedType = `from (${enumArray.join(",")})`;
  return isNumber(index) ? templates$1.error_type_with_index({
    functionName,
    propertyName,
    value,
    expectedType,
    index
  }) : templates$1.error_type({
    functionName,
    propertyName,
    value,
    expectedType
  });
};
const patternMismatchMessage = ({ functionName, propertyName, value, index }) => {
  return isNumber(index) ? templates$1.error_bad_format_with_index({
    functionName,
    propertyName,
    value,
    index
  }) : templates$1.error_bad_format({ functionName, propertyName, value });
};
const WIX_SDK_ERROR_TEXT$1 = "Wix code SDK error:";
const WIX_SDK_WARNING_TEXT = "Wix code SDK warning:";
const reportError$1 = (message) => {
  console.error(`${WIX_SDK_ERROR_TEXT$1} ${message}`);
};
const reportWarning = (message) => {
  console.warn(`${WIX_SDK_WARNING_TEXT} ${message}`);
};
function validateNumber(value, schema, reportError2, messageParams) {
  const { minimum, maximum, enum: enumArray } = schema;
  if (!isNumber(value)) {
    return ValidationResult.InvalidType;
  }
  if (enumArray && !isIn(value, enumArray)) {
    reportError2(invalidEnumValueMessage({
      value,
      enum: enumArray,
      ...messageParams
    }), { ...messageParams, value });
    return ValidationResult.Invalid;
  }
  if (isNumber(minimum) && isBelow(value, minimum) || isNumber(maximum) && isAbove(value, maximum)) {
    reportError2(invalidNumberBoundsMessage({
      value,
      minimum,
      maximum,
      ...messageParams
    }), { ...messageParams, value });
    return ValidationResult.Invalid;
  }
  return ValidationResult.Valid;
}
function validateInteger(value, schema, reportError2, messageParams) {
  const { minimum, maximum, enum: enumArray } = schema;
  if (!isInteger(value)) {
    return ValidationResult.InvalidType;
  }
  if (enumArray && !isIn(value, enumArray)) {
    reportError2(invalidEnumValueMessage({
      value,
      enum: enumArray,
      ...messageParams
    }), { ...messageParams, value });
    return ValidationResult.Invalid;
  }
  if (isNumber(minimum) && isBelow(value, minimum) || isNumber(maximum) && isAbove(value, maximum)) {
    reportError2(invalidNumberBoundsMessage({
      value,
      minimum,
      maximum,
      ...messageParams
    }), { ...messageParams, value });
    return ValidationResult.Invalid;
  }
  return ValidationResult.Valid;
}
function validateString(value, schema, reportError2, messageParams) {
  const { minLength, maxLength, enum: enumArray, pattern } = schema;
  if (!isString(value)) {
    return ValidationResult.InvalidType;
  }
  if (enumArray && !isIn(value, enumArray)) {
    reportError2(invalidEnumValueMessage({
      value,
      enum: enumArray,
      ...messageParams
    }), { ...messageParams, value });
    return ValidationResult.Invalid;
  }
  if (minLength && isBelow(value.length, minLength) || maxLength && isAbove(value.length, maxLength)) {
    reportError2(invalidStringLengthMessage({
      value,
      minimum: minLength,
      maximum: maxLength,
      ...messageParams
    }), { ...messageParams, value });
    return ValidationResult.Invalid;
  }
  if (pattern && !new RegExp(pattern).test(value)) {
    reportError2(patternMismatchMessage({
      value,
      ...messageParams
    }), { ...messageParams, value });
    return ValidationResult.Invalid;
  }
  return ValidationResult.Valid;
}
function validateBoolean(value) {
  if (!isBoolean(value)) {
    return ValidationResult.InvalidType;
  }
  return ValidationResult.Valid;
}
function validateDate(value) {
  if (!isDate(value)) {
    return ValidationResult.InvalidType;
  }
  return ValidationResult.Valid;
}
function validateNil(value) {
  if (!isNil(value)) {
    return ValidationResult.InvalidType;
  }
  return ValidationResult.Valid;
}
function validateFunction(value) {
  if (!isFunction(value)) {
    return ValidationResult.InvalidType;
  }
  return ValidationResult.Valid;
}
function isTupleSchema(schema) {
  return Array.isArray(schema);
}
function validateArray(value, schema, validateSchema, reportError2, messageParams, suppressIndexError = false) {
  if (!isArray(value)) {
    return ValidationResult.InvalidType;
  }
  let isValid = ValidationResult.Valid;
  if (schema.items) {
    const itemsToValidateCount = isTupleSchema(schema.items) ? Math.min(value.length, schema.items.length) : value.length;
    for (let itemIndex = 0; itemIndex < itemsToValidateCount; itemIndex++) {
      const item = value[itemIndex];
      let itemSchema;
      let propName;
      if (isTupleSchema(schema.items)) {
        itemSchema = schema.items[itemIndex];
        propName = schema.items[itemIndex].name;
      } else {
        itemSchema = schema.items;
        propName = schema.name;
      }
      const isItemValid = validateSchema(item, itemSchema, {
        functionName: messageParams.functionName,
        propertyName: propName || messageParams.propertyName,
        index: !suppressIndexError ? itemIndex : void 0
      });
      if (!isItemValid) {
        isValid = ValidationResult.Invalid;
      }
    }
  }
  return isValid;
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const noop = () => {
};
function validateObject(value, schema, validateSchema, reportError2, reportWarning2, messageParams) {
  if (!isObject(value)) {
    return ValidationResult.InvalidType;
  }
  if (schema.oneOf) {
    return schema.oneOf.map((variant) => validateObject(value, variant, validateSchema, noop, reportWarning2, messageParams)).filter((validity) => validity === ValidationResult.Valid).length === 1 ? ValidationResult.Valid : ValidationResult.Invalid;
  }
  if (schema.required) {
    for (let propNameIdx = 0; propNameIdx < schema.required.length; propNameIdx++) {
      if (!hasOwnProperty.call(value, schema.required[propNameIdx])) {
        reportError2(missingFieldMessage({
          functionName: messageParams.functionName,
          index: messageParams.index,
          propertyName: schema.required[propNameIdx]
        }), { ...messageParams, value });
        return ValidationResult.Invalid;
      }
    }
  }
  const propNames = getOwnPropertyNames(schema.properties ?? {});
  if (schema.additionalProperties === false) {
    const invalidPropertyNames = getOwnPropertyNames(value).filter((key) => !propNames.includes(key));
    if (invalidPropertyNames.length) {
      const message = unknownFieldMessage({
        functionName: messageParams.functionName,
        index: messageParams.index,
        propertyNames: invalidPropertyNames
      });
      reportError2(message);
      return ValidationResult.Invalid;
    }
  }
  for (let propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
    const propName = propNames[propNameIdx];
    if (hasOwnProperty.call(value, propName)) {
      const propSchema = schema.properties[propName];
      const propValue = value[propName];
      if (!validateSchema(propValue, propSchema, {
        functionName: messageParams.functionName,
        index: messageParams.index,
        propertyName: propName
      })) {
        return ValidationResult.Invalid;
      }
    }
  }
  return ValidationResult.Valid;
}
const ValidationResult = {
  Valid: "valid",
  Invalid: "invalid",
  InvalidType: "invalid-type"
};
function createSchemaValidator({ reportError: reportError2, reportWarning: reportWarning2 }, compName, { suppressIndexErrors = false } = {}) {
  function validate(value, schema, setterName) {
    return validateSchema(value, schema, {
      functionName: setterName,
      propertyName: setterName,
      /**
       * This intentional? In such a case all errors related to "index"
       * will never be fired
       */
      index: void 0
    });
  }
  function validateSchema(value, schema, params) {
    if (schema.warnIfNil && isNil(value)) {
      reportWarning2(nilAssignmentMessage$1({
        ...params,
        compName
      }), { ...params, value });
    }
    let typeIdx = 0;
    for (; typeIdx < schema.type.length; typeIdx++) {
      const validateSchemaForType = validatorsMap[schema.type[typeIdx]];
      const validationResult = validateSchemaForType(value, schema, params);
      if (validationResult !== ValidationResult.InvalidType) {
        return validationResult === ValidationResult.Valid;
      }
    }
    if (typeIdx === schema.type.length) {
      reportError2(invalidTypeMessage({
        value,
        types: schema.type,
        ...params
      }), { ...params, value });
    }
    return false;
  }
  const validatorsMap = {
    object: (value, schema, messageParams) => {
      return validateObject(value, schema, validateSchema, reportError2, reportWarning2, messageParams);
    },
    array: (value, schema, messageParams) => {
      return validateArray(value, schema, validateSchema, reportError2, messageParams, suppressIndexErrors);
    },
    number: (value, schema, messageParams) => {
      return validateNumber(value, schema, reportError2, messageParams);
    },
    integer: (value, schema, messageParams) => {
      return validateInteger(value, schema, reportError2, messageParams);
    },
    string: (value, schema, messageParams) => {
      return validateString(value, schema, reportError2, messageParams);
    },
    boolean: (value) => {
      return validateBoolean(value);
    },
    date: (value) => {
      return validateDate(value);
    },
    nil: (value) => {
      return validateNil(value);
    },
    function: (value) => {
      return validateFunction(value);
    }
  };
  return validate;
}
function createCompSchemaValidator(compName, { suppressIndexErrors = false } = {}) {
  return createSchemaValidator({ reportError: reportError$1, reportWarning }, compName, {
    suppressIndexErrors
  });
}
const reactToCorvidEventType = {
  dblclick: "dblClick",
  keydown: "keyPress",
  input: "onInput"
};
const convertToCorvidEventBase = (event) => {
  const { target, type, context } = event;
  return { target, type: reactToCorvidEventType[type] ?? type, context };
};
const convertToCorvidMouseEvent = (event) => {
  const { clientX, clientY, pageX, pageY, screenX, screenY, nativeEvent } = event;
  const { offsetX, offsetY } = nativeEvent;
  return {
    clientX,
    clientY,
    pageX,
    pageY,
    screenX,
    screenY,
    offsetX,
    offsetY
  };
};
const functionValidator = (value, eventName, role) => {
  return createCompSchemaValidator(role)(value, {
    type: ["function"]
  }, eventName);
};
const eventNameMapToMethodName = {
  onMouseEnter: "onMouseIn",
  onMouseLeave: "onMouseOut"
};
const createEventListenerState = (api) => {
  return api.createSdkState({ listeners: [] }, "eventListeners");
};
const registerCorvidEvent = (eventName, api, cb, projection) => {
  const { create$w, createEvent, registerEvent, getSdkInstance, metaData } = api;
  const setterName = eventNameMapToMethodName[eventName] ?? eventName;
  if (!functionValidator(cb, setterName, metaData.role)) {
    return getSdkInstance();
  }
  const [eventListenerState, setEventListenerState] = createEventListenerState(api);
  const unregisterEvent = registerEvent(
    eventName,
    /**
     * `eventPayload` adds extra data into native React events
     * which will be sanitized by the platform
     */
    (event, eventPayload) => {
      const baseEvent = createEvent({ type: event.type, compId: event.compId });
      const $w = create$w({ context: baseEvent.context });
      const projectionEvent = projection == null ? void 0 : projection({
        componentEvent: event,
        eventPayload
      });
      cb({
        ...convertToCorvidEventBase(baseEvent),
        ...projectionEvent
      }, $w);
    }
  );
  const listener = {
    eventName,
    compId: metaData.compId,
    cb,
    unregister: unregisterEvent
  };
  setEventListenerState({
    listeners: [...eventListenerState.listeners, listener]
  });
  return getSdkInstance();
};
const registerCorvidMouseEvent = (eventName, api, cb, payloadProjection) => registerCorvidEvent(eventName, api, cb, ({ componentEvent, eventPayload }) => ({
  ...convertToCorvidMouseEvent(componentEvent),
  ...eventPayload && (payloadProjection == null ? void 0 : payloadProjection(eventPayload))
}));
function composeSDKFactories(sources) {
  return (api) => {
    const target = {};
    for (let sourceIdx = 0; sourceIdx < sources.length; sourceIdx++) {
      const source = sources[sourceIdx](api);
      const sourceKeys = Object.keys(source);
      for (let sourceKeyIdx = 0; sourceKeyIdx < sourceKeys.length; sourceKeyIdx++) {
        const sourceKey = sourceKeys[sourceKeyIdx];
        const sourceProp = Object.getOwnPropertyDescriptor(
          source,
          sourceKey
        );
        Object.defineProperty(target, sourceKey, sourceProp);
      }
    }
    return target;
  };
}
var dist$2 = {};
var definition$1 = {};
var dist$1 = {};
var staticService$1 = {};
var build = {};
var hasRequiredBuild;
function requireBuild() {
  if (hasRequiredBuild) return build;
  hasRequiredBuild = 1;
  Object.defineProperty(build, "__esModule", { value: true });
  build.defineService = defineService;
  build.implementService = implementService;
  function defineService(id) {
    return id;
  }
  function implementService(_, factory) {
    return factory;
  }
  implementService.withConfig = function() {
    return function(_, factory) {
      return factory;
    };
  };
  return build;
}
var hasRequiredStaticService$1;
function requireStaticService$1() {
  if (hasRequiredStaticService$1) return staticService$1;
  hasRequiredStaticService$1 = 1;
  Object.defineProperty(staticService$1, "__esModule", { value: true });
  staticService$1.implementStaticService = staticService$1.defineStaticService = void 0;
  const services_definitions_1 = /* @__PURE__ */ requireBuild();
  staticService$1.defineStaticService = services_definitions_1.defineService;
  staticService$1.implementStaticService = services_definitions_1.implementService;
  return staticService$1;
}
var hasRequiredDist$2;
function requireDist$2() {
  if (hasRequiredDist$2) return dist$1;
  hasRequiredDist$2 = 1;
  (function(exports$1) {
    var __createBinding = dist$1 && dist$1.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = dist$1 && dist$1.__exportStar || function(m, exports$12) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    __exportStar(/* @__PURE__ */ requireStaticService$1(), exports$1);
  })(dist$1);
  return dist$1;
}
var hasRequiredDefinition$1;
function requireDefinition$1() {
  if (hasRequiredDefinition$1) return definition$1;
  hasRequiredDefinition$1 = 1;
  Object.defineProperty(definition$1, "__esModule", { value: true });
  definition$1.LinkUtilsDefinition = void 0;
  const static_service_1 = /* @__PURE__ */ requireDist$2();
  definition$1.LinkUtilsDefinition = (0, static_service_1.defineStaticService)("viewer-core/viewer-service-link-utils");
  return definition$1;
}
var externalLinkUtils = {};
var definition = {};
var dist = {};
var staticService = {};
var hasRequiredStaticService;
function requireStaticService() {
  if (hasRequiredStaticService) return staticService;
  hasRequiredStaticService = 1;
  Object.defineProperty(staticService, "__esModule", { value: true });
  staticService.implementStaticService = staticService.defineStaticService = void 0;
  const services_definitions_1 = /* @__PURE__ */ requireBuild();
  staticService.defineStaticService = services_definitions_1.defineService;
  staticService.implementStaticService = services_definitions_1.implementService;
  return staticService;
}
var hasRequiredDist$1;
function requireDist$1() {
  if (hasRequiredDist$1) return dist;
  hasRequiredDist$1 = 1;
  (function(exports$1) {
    var __createBinding = dist && dist.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = dist && dist.__exportStar || function(m, exports$12) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    __exportStar(/* @__PURE__ */ requireStaticService(), exports$1);
  })(dist);
  return dist;
}
var hasRequiredDefinition;
function requireDefinition() {
  if (hasRequiredDefinition) return definition;
  hasRequiredDefinition = 1;
  Object.defineProperty(definition, "__esModule", { value: true });
  definition.EnvironmentDefinition = void 0;
  const static_service_1 = /* @__PURE__ */ requireDist$1();
  definition.EnvironmentDefinition = (0, static_service_1.defineStaticService)("viewer-core/viewer-service-environment");
  return definition;
}
var sharedLinkUtils = {};
var links = {};
var linkPatternUtils = {};
var hasRequiredLinkPatternUtils;
function requireLinkPatternUtils() {
  if (hasRequiredLinkPatternUtils) return linkPatternUtils;
  hasRequiredLinkPatternUtils = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.isScrollTopOrBottomAnchor = exports$1.isSamePageAnchorUrl = exports$1.isPageUrl = exports$1.isAbsoluteUrl = exports$1.isDocumentUrl = exports$1.isMailtoUrl = exports$1.isWhatsappLink = exports$1.isPhoneUrl = exports$1.LEGACY_DOCUMENT_URL_REGEXP = exports$1.DOCUMENT_URL_REGEXP = exports$1.ABSOLUTE_URL_REGEXP = exports$1.SAME_PAGE_WITH_ANCHOR_REGEXP = exports$1.PAGE_URL_REGEXP = exports$1.WHATSAPP_LINK_PREFIX = exports$1.PHONE_URL_REGEXP = exports$1.MAILTO_URL_REGEXP = void 0;
    exports$1.MAILTO_URL_REGEXP = /mailto:([^?]+)(\?(.*))?/;
    exports$1.PHONE_URL_REGEXP = /^tel:(.*)/;
    exports$1.WHATSAPP_LINK_PREFIX = `https://api.whatsapp.com/send?phone=`;
    exports$1.PAGE_URL_REGEXP = /^\/([^?#]*)?[#]?([^?#]*)[?]?(.*)/;
    exports$1.SAME_PAGE_WITH_ANCHOR_REGEXP = /^#([^?]*)[?]?(.*)/;
    exports$1.ABSOLUTE_URL_REGEXP = /^(http|https):\/\/(.*)/;
    exports$1.DOCUMENT_URL_REGEXP = /^wix:document:\/\/v1\/(.+)\/(.+)/;
    exports$1.LEGACY_DOCUMENT_URL_REGEXP = /^document:\/\/(.*)/;
    const isPhoneUrl = (url) => exports$1.PHONE_URL_REGEXP.test(url);
    exports$1.isPhoneUrl = isPhoneUrl;
    const isWhatsappLink = (url) => url.startsWith(exports$1.WHATSAPP_LINK_PREFIX);
    exports$1.isWhatsappLink = isWhatsappLink;
    const isMailtoUrl = (url) => exports$1.MAILTO_URL_REGEXP.test(url);
    exports$1.isMailtoUrl = isMailtoUrl;
    const isDocumentUrl = (url) => exports$1.DOCUMENT_URL_REGEXP.test(url) || exports$1.LEGACY_DOCUMENT_URL_REGEXP.test(url);
    exports$1.isDocumentUrl = isDocumentUrl;
    const isAbsoluteUrl = (url) => exports$1.ABSOLUTE_URL_REGEXP.test(url);
    exports$1.isAbsoluteUrl = isAbsoluteUrl;
    const isPageUrl2 = (href) => exports$1.PAGE_URL_REGEXP.test(href);
    exports$1.isPageUrl = isPageUrl2;
    const isSamePageAnchorUrl = (href) => exports$1.SAME_PAGE_WITH_ANCHOR_REGEXP.test(href);
    exports$1.isSamePageAnchorUrl = isSamePageAnchorUrl;
    const isScrollTopOrBottomAnchor = (anchorDataId) => ["SCROLL_TO_TOP", "SCROLL_TO_BOTTOM"].includes(anchorDataId);
    exports$1.isScrollTopOrBottomAnchor = isScrollTopOrBottomAnchor;
  })(linkPatternUtils);
  return linkPatternUtils;
}
var hasRequiredLinks;
function requireLinks() {
  if (hasRequiredLinks) return links;
  hasRequiredLinks = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.hasLinkDataWithCurrentRouteAnchors = exports$1.getDocumentLink = exports$1.resolveDocumentLink = exports$1.getBaseUrlFilesPath = exports$1.resolveDynamicPageLink = exports$1.resolveAddressLink = exports$1.resolveWhatsAppLink = exports$1.resolvePhoneLink = exports$1.resolveEmailLink = exports$1.getPostSignupUrl = exports$1.getImpliedLink = exports$1.convertDataQueryLinksToHtmlAnchors = exports$1.toQueryString = exports$1.ALLOWED_FILE_EXTENSIONS_FROM_USER_DOMAIN = exports$1.getDocumentLinkProps = exports$1.replaceUrls = exports$1.replacePhoneNumbers = exports$1.replaceEmails = exports$1.getUrlWithProtocol = exports$1.PatternType = void 0;
    exports$1.findFirstMatch = findFirstMatch;
    exports$1.getImpliedLinks = getImpliedLinks;
    const linkPatternUtils_1 = /* @__PURE__ */ requireLinkPatternUtils();
    const PHONE_NUMBER_PATTERN = /(?:\+|\()?\d(?:[-.() \t\u00a0\u1680\u180e\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{0,5}\d){6,16}\)?(?![<@)\w])|\*\d{4}(?![<@)\w])/;
    const PHONE_NUMBER_AS_WORD_PATTERN = /(?:^|[\s:;,<>])(?:\+|\()?\d(?:[-.() \t\u00a0\u1680\u180e\u2000\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]{0,5}\d){6,16}\)?(?![<@)\w])|\*\d{4}(?![<@)\w])/;
    const EMAIL_PATTERN = /(^|[\s:;,<>])([A-Z0-9][A-Z0-9._%+-]+@[A-Z0-9][A-Z0-9.-]+\.[A-Z]{2,})(?=$|[\s:;,<>])/i;
    const URL_PATTERN = /(^|[\s:;,<>])((?:https?:\/\/|www\.)[a-z0-9](?:\.?[a-z0-9\-%_])*(?:(?:\\|\/)[a-z0-9\-._~:/\\?#[\]@!$&'()*+,;=%]*)?)(?=$|[^a-z0-9\-._~:/\\?#[\]@!$&'()*+,;=%])/i;
    const GLOBAL_PHONE_NUMBER_AS_WORD_PATTERN = new RegExp(PHONE_NUMBER_AS_WORD_PATTERN, "g");
    const GLOBAL_EMAIL_PATTERN = /([A-Z0-9][A-Z0-9._%+-]+@[A-Z0-9][A-Z0-9.-]+\.[A-Z]{2,})/gi;
    const GLOBAL_URL_PATTERN = /((?:https?:\/\/|www\.)[a-z0-9](?:\.?[a-z0-9\-%_])*(?:(?:\\|\/)[a-z0-9\-._~:/\\?#[\]@!$&'()*+,;=%]*)?)/gi;
    exports$1.PatternType = {
      PHONE: "PHONE",
      MAIL: "MAIL",
      URL: "URL"
    };
    const findPhoneNumber = (text) => {
      const matching = text.match(PHONE_NUMBER_PATTERN);
      return matching && {
        key: matching[0],
        value: matching[0].match(/[*\d]/g).join(""),
        index: matching.index,
        pattern: exports$1.PatternType.PHONE
      };
    };
    const findEmail = (text) => {
      const matching = text.match(EMAIL_PATTERN);
      if (matching) {
        const prefixSize = matching[1].length;
        const mainCapture = matching[2];
        return {
          key: mainCapture,
          value: mainCapture,
          index: matching.index + prefixSize,
          pattern: exports$1.PatternType.MAIL
        };
      } else {
        return null;
      }
    };
    const getUrlWithProtocol = (url) => {
      const beginsWithHttp = url.toLowerCase().indexOf("http") === 0;
      return beginsWithHttp ? url : `http://${url}`;
    };
    exports$1.getUrlWithProtocol = getUrlWithProtocol;
    const findUrl = (text) => {
      const matching = text.match(URL_PATTERN);
      if (matching) {
        const mainCapture = matching[2];
        const prefixSize = matching[1].length;
        const value = (0, exports$1.getUrlWithProtocol)(mainCapture);
        return {
          key: mainCapture,
          value,
          index: matching.index + prefixSize,
          pattern: exports$1.PatternType.URL
        };
      } else {
        return null;
      }
    };
    const replaceEmails = (str, replacer) => str.replace(GLOBAL_EMAIL_PATTERN, replacer);
    exports$1.replaceEmails = replaceEmails;
    const possiblePrefixes = [" ", ":", ";", ",", "<", ">"];
    const replacePhoneNumbers = (str, replacer) => {
      return str.replace(GLOBAL_PHONE_NUMBER_AS_WORD_PATTERN, (match) => {
        const prefix = possiblePrefixes.find((i) => i === match[0]);
        return prefix ? prefix + replacer(match.substring(1, match.length)) : replacer(match);
      });
    };
    exports$1.replacePhoneNumbers = replacePhoneNumbers;
    const replaceUrls = (str, replacer) => str.replace(GLOBAL_URL_PATTERN, replacer);
    exports$1.replaceUrls = replaceUrls;
    const patternToMatchingFunc = {
      [exports$1.PatternType.PHONE]: findPhoneNumber,
      [exports$1.PatternType.MAIL]: findEmail,
      [exports$1.PatternType.URL]: findUrl
    };
    function findFirstMatch(text, patterns = {}) {
      if (!text) {
        return null;
      }
      const matches = Object.keys(patterns).filter((key) => patterns[key]).map((key) => patternToMatchingFunc[key](text)).filter((value) => value !== null);
      const firstMatch = matches[0] ? matches.reduce((prev, curr) => {
        return curr.index < prev.index ? curr : prev;
      }, matches[0]) : null;
      return firstMatch;
    }
    const getDocumentLinkProps = (documentUrl, metaSiteId, userFileDomainUrl = "filesusr.com/", externalBaseUrl = "", isPremiumDomain = false, isResolveDocumentLinkEnabled = false) => {
      const [, docId, name] = linkPatternUtils_1.DOCUMENT_URL_REGEXP.exec(documentUrl) || linkPatternUtils_1.LEGACY_DOCUMENT_URL_REGEXP.exec(documentUrl);
      return {
        type: "DocumentLink",
        href: (0, exports$1.resolveDocumentLink)({ docId, name: name || "", indexable: false }, metaSiteId, userFileDomainUrl, externalBaseUrl, isPremiumDomain, isResolveDocumentLinkEnabled),
        target: "_blank",
        docInfo: {
          docId,
          name
        }
      };
    };
    exports$1.getDocumentLinkProps = getDocumentLinkProps;
    exports$1.ALLOWED_FILE_EXTENSIONS_FROM_USER_DOMAIN = [
      "pdf",
      "docx",
      "zip",
      "pptx",
      "xlsx",
      "doc",
      "txt",
      "rar",
      "xls",
      "ppt",
      "ppsx",
      "epub",
      "rtf",
      "pub",
      "vcf",
      "csv"
    ];
    const PatternToPrefix = {
      [exports$1.PatternType.PHONE]: "tel:",
      [exports$1.PatternType.MAIL]: "mailto:",
      [exports$1.PatternType.URL]: ""
    };
    const parseLinkValue = ({ pattern, value }) => {
      const baseLinkProps = pattern === exports$1.PatternType.URL ? { target: "_blank" } : {};
      return { ...baseLinkProps, href: `${PatternToPrefix[pattern]}${value}` };
    };
    const getPropertyName = (key) => {
      switch (key) {
        case "linkPopupId":
          return "data-popupid";
        case "anchorDataId":
          return "data-anchor";
        case "anchorCompId":
          return "data-anchor-comp-id";
        default:
          return key;
      }
    };
    const toQueryString = (queryObject) => Object.keys(queryObject).map((key) => `${key}=${encodeURIComponent(queryObject[key])}`).join("&");
    exports$1.toQueryString = toQueryString;
    const getLinkAttributes = (linkProps) => {
      if (linkProps) {
        if (linkProps.linkPopupId) {
          linkProps.role = "button";
          linkProps["aria-haspopup"] = "dialog";
          linkProps.tabindex = "0";
          delete linkProps.href;
        }
        return Object.keys(linkProps).map((key) => `${getPropertyName(key)}="${linkProps[key]}"`).join(" ");
      }
      return "";
    };
    const joinAttributesParts = (attributesParts) => attributesParts.filter((attributesPart) => attributesPart !== "").map((attributesPart) => attributesPart.trim()).join(" ");
    const convertDataQueryLinksToHtmlAnchors = (text, linkList) => text.replace(/<a ([^>]*)dataquery="#([^"]+)"([^>]*)>/g, (_full, preAttributes, dataQuery, postAttributes) => {
      const linkProps = linkList[dataQuery];
      const fixedAttributes = joinAttributesParts([preAttributes, getLinkAttributes(linkProps), postAttributes]);
      return `<a${fixedAttributes ? ` ${fixedAttributes}` : ""}>`;
    });
    exports$1.convertDataQueryLinksToHtmlAnchors = convertDataQueryLinksToHtmlAnchors;
    const getImpliedLink = (text, isMobileView) => {
      const firstMatch = findFirstMatch(text, { MAIL: true, URL: true, PHONE: isMobileView });
      return firstMatch && parseLinkValue(firstMatch);
    };
    exports$1.getImpliedLink = getImpliedLink;
    const getLinkWrapperFunction = (type) => (content) => {
      let aTagContent = "";
      const href = content.trim();
      switch (type) {
        case "email":
          aTagContent = `href="mailto:${href}"`;
          break;
        case "phone":
          aTagContent = `href="tel:${href}"`;
          break;
        case "url":
          aTagContent = `href="${(0, exports$1.getUrlWithProtocol)(href)}" target="_blank"`;
          break;
      }
      return `<a data-auto-recognition="true" ${aTagContent}>${content}</a>`;
    };
    const wrapEmailImpliedLink = getLinkWrapperFunction("email");
    const wrapUrlImpliedLink = getLinkWrapperFunction("url");
    const wrapPhoneImpliedLink = getLinkWrapperFunction("phone");
    const getTextLinkMatcher = (isMobileView, parseEscaped) => (fullMatch, text) => {
      if (!text || !parseEscaped && text.startsWith("&lt;")) {
        return fullMatch;
      }
      let textWithLinks = (0, exports$1.replaceEmails)(text, wrapEmailImpliedLink);
      textWithLinks = (0, exports$1.replaceUrls)(textWithLinks, wrapUrlImpliedLink);
      if (isMobileView) {
        textWithLinks = (0, exports$1.replacePhoneNumbers)(textWithLinks, wrapPhoneImpliedLink);
      }
      return fullMatch.split(text).join(textWithLinks);
    };
    function getImpliedLinks(text, isMobileView, { parseEscaped } = { parseEscaped: false }) {
      return text.replace(/>((?![<>]).+?)<|(?:<a.*>.*<\/a>)/g, getTextLinkMatcher(isMobileView, parseEscaped));
    }
    const getPostSignupUrl = (postSignupUrl) => {
      const placeholder = "{ifcontext}";
      if (!postSignupUrl.includes(placeholder)) {
        return postSignupUrl;
      }
      const [, queryString] = postSignupUrl.split("?");
      const urlSearchParams = new URLSearchParams(queryString);
      let target;
      let postSignupUrlWithContext = "";
      urlSearchParams.forEach((value, key) => {
        if (key.toLowerCase() !== "ifcontext") {
          return;
        }
        target = value.replace("#", "");
        if (/^[a-zA-Z0-9]+$/.test(target)) {
          postSignupUrlWithContext = postSignupUrl.replace(placeholder, target);
        } else {
          postSignupUrlWithContext = postSignupUrl.replace(placeholder, "illegalContextValue");
        }
      });
      return postSignupUrlWithContext || postSignupUrl;
    };
    exports$1.getPostSignupUrl = getPostSignupUrl;
    const resolveEmailLink = ({ recipient, subject, body, bcc = void 0, cc = void 0 }) => {
      const queryString = Object.entries({ subject, body, bcc, cc }).filter(([, value]) => value).map(([key, value]) => `${key}=${value}`).join("&");
      const query = queryString.length > 0 ? `?${queryString}` : "";
      return `mailto:${recipient}${query}`;
    };
    exports$1.resolveEmailLink = resolveEmailLink;
    const resolvePhoneLink = ({ phoneNumber }) => `tel:${phoneNumber}`;
    exports$1.resolvePhoneLink = resolvePhoneLink;
    const resolveWhatsAppLink = ({ phoneNumber }) => {
      const sanitizedPhoneNumber = phoneNumber.replace(new RegExp("[+|-]", "g"), "");
      return `${linkPatternUtils_1.WHATSAPP_LINK_PREFIX}${sanitizedPhoneNumber}`;
    };
    exports$1.resolveWhatsAppLink = resolveWhatsAppLink;
    const resolveAddressLink = ({ address }) => `http://maps.google.com/maps?daddr=${encodeURI(address)}`;
    exports$1.resolveAddressLink = resolveAddressLink;
    const getInnerRouteSuffix = (innerRoute) => innerRoute && innerRoute.replace(/^\//, "");
    const resolveDynamicPageLink = (externalBaseUrl, { innerRoute }, routerInfo) => {
      const { prefix } = routerInfo;
      const innerRouteSuffix = getInnerRouteSuffix(innerRoute);
      return innerRouteSuffix ? `${externalBaseUrl}/${prefix}/${innerRouteSuffix}` : `${externalBaseUrl}/${prefix}`;
    };
    exports$1.resolveDynamicPageLink = resolveDynamicPageLink;
    const isFreeSite = (url) => {
      const hostname = new URL(url).hostname;
      return hostname.endsWith(".wixsite.com") || hostname.endsWith(".editorx.io") || hostname.endsWith(".wixstudio.io") || hostname.endsWith(".wixstudio.com");
    };
    const shouldServeFileFromUserDomain = (isPremiumDomain, externalBaseUrl, docId) => {
      const isPreview = new URL(externalBaseUrl).hostname.startsWith("editor.wix");
      if (!isPremiumDomain || isPreview || isFreeSite(externalBaseUrl)) {
        return false;
      }
      return exports$1.ALLOWED_FILE_EXTENSIONS_FROM_USER_DOMAIN.some((fileExtension) => docId.endsWith(fileExtension));
    };
    const getDocumentLinkSuffix = (docId, name, indexable) => {
      const isPDF = docId.endsWith(".pdf");
      if (isPDF) {
        return indexable ? "?index=true" : "";
      }
      return `?${(0, exports$1.toQueryString)({ dn: name })}`;
    };
    const getBaseUrlFilesPath = (externalBaseUrl) => {
      const externalBaseUrlWithTrailingSlash = externalBaseUrl.endsWith("/") ? externalBaseUrl : `${externalBaseUrl}/`;
      return new URL("_files", externalBaseUrlWithTrailingSlash);
    };
    exports$1.getBaseUrlFilesPath = getBaseUrlFilesPath;
    const resolveDocumentLink = ({ docId, name, indexable }, metaSiteId, userFileDomainUrl, externalBaseUrl, isPremiumDomain, isResolveDocumentLinkEnabled = false) => {
      if (!isResolveDocumentLinkEnabled) {
        return "";
      }
      const serveFileFromUserDomain = shouldServeFileFromUserDomain(isPremiumDomain, externalBaseUrl, docId);
      const baseUrl = serveFileFromUserDomain ? (0, exports$1.getBaseUrlFilesPath)(externalBaseUrl) : `https://${metaSiteId}.${userFileDomainUrl}`;
      const prefixedDocId = docId.includes("/") ? docId : `ugd/${docId}`;
      const prefixedDocIdWithSlash = prefixedDocId.startsWith("/") ? prefixedDocId : `/${prefixedDocId}`;
      const suffix = getDocumentLinkSuffix(docId, name, indexable);
      return `${baseUrl}${prefixedDocIdWithSlash}${suffix}`;
    };
    exports$1.resolveDocumentLink = resolveDocumentLink;
    const getDocumentLink = (docId, name = "") => `wix:document://v1/${docId}/${name}`;
    exports$1.getDocumentLink = getDocumentLink;
    const hasLinkDataWithCurrentRouteAnchors = (dataItem) => {
      var _a, _b;
      const subDataItems = (dataItem == null ? void 0 : dataItem.items) || (dataItem == null ? void 0 : dataItem.linkList) || (dataItem == null ? void 0 : dataItem.menuRef) || [];
      const anchorDataId = (dataItem == null ? void 0 : dataItem.anchorDataId) || ((_a = dataItem == null ? void 0 : dataItem.link) == null ? void 0 : _a.anchorDataId) || "";
      const innerRoute = (dataItem == null ? void 0 : dataItem.innerRoute) || ((_b = dataItem == null ? void 0 : dataItem.link) == null ? void 0 : _b.innerRoute);
      const isLinkWithTopBottomAnchor = ["SCROLL_TO_TOP", "SCROLL_TO_BOTTOM"].includes(anchorDataId);
      const isCurrentInnerRouteDynamicPageLink = innerRoute === "CURRENT_INNER_ROUTE";
      return isLinkWithTopBottomAnchor || isCurrentInnerRouteDynamicPageLink || subDataItems.some((item) => (0, exports$1.hasLinkDataWithCurrentRouteAnchors)(item));
    };
    exports$1.hasLinkDataWithCurrentRouteAnchors = hasLinkDataWithCurrentRouteAnchors;
  })(links);
  return links;
}
var hasRequiredSharedLinkUtils;
function requireSharedLinkUtils() {
  if (hasRequiredSharedLinkUtils) return sharedLinkUtils;
  hasRequiredSharedLinkUtils = 1;
  Object.defineProperty(sharedLinkUtils, "__esModule", { value: true });
  sharedLinkUtils.createSharedLinkUtils = sharedLinkUtils.UnsupportedLinkTypeError = void 0;
  const links_1 = /* @__PURE__ */ requireLinks();
  const linkPatternUtils_1 = /* @__PURE__ */ requireLinkPatternUtils();
  const TYPE_TO_ANCHOR_NAME = {
    SCROLL_TO_TOP: "top",
    SCROLL_TO_BOTTOM: "bottom"
  };
  const getEscapedQueries = (queryParams) => ({
    subject: encodeURIComponent(queryParams.get("subject") || ""),
    body: encodeURIComponent(queryParams.get("body") || ""),
    bcc: encodeURIComponent(queryParams.get("bcc") || ""),
    cc: encodeURIComponent(queryParams.get("cc") || "")
  });
  const getMailtoLinkProps = (mailtoUrl) => {
    const [, recipient, queries] = linkPatternUtils_1.MAILTO_URL_REGEXP.exec(mailtoUrl);
    const escapedQuery = getEscapedQueries(new URLSearchParams(queries));
    return {
      type: "EmailLink",
      href: (0, links_1.resolveEmailLink)({ recipient, ...escapedQuery }),
      target: "_self"
    };
  };
  const getPhoneLinkProps = (telUrl) => {
    const [, phoneNumber] = linkPatternUtils_1.PHONE_URL_REGEXP.exec(telUrl);
    return {
      type: "PhoneLink",
      href: (0, links_1.resolvePhoneLink)({ phoneNumber }),
      target: "_self"
    };
  };
  const getExternalLinkProps = (url, target = "_blank", rel = "noopener") => {
    return {
      type: "ExternalLink",
      href: url,
      target,
      rel
    };
  };
  class UnsupportedLinkTypeError2 extends Error {
    constructor() {
      super("Unsupported link type");
      this.name = "UnsupportedLinkTypeError";
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, UnsupportedLinkTypeError2);
      }
    }
  }
  sharedLinkUtils.UnsupportedLinkTypeError = UnsupportedLinkTypeError2;
  const createSharedLinkUtils = (config) => {
    const { metaSiteId, isMobileView, userFileDomainUrl, externalBaseUrl, isPremiumDomain, isResolveDocumentLinkEnabled = false } = config;
    const BASE_DOCUMENTS_URL = `https://${metaSiteId}.filesusr.com/`;
    const isDocumentHref = (href) => href.startsWith(BASE_DOCUMENTS_URL);
    return {
      getImpliedLink: (text) => (0, links_1.getImpliedLink)(text, isMobileView),
      getImpliedLinks: (text, getImpliedLinksConfig) => (0, links_1.getImpliedLinks)(text, isMobileView, getImpliedLinksConfig),
      getLink: ({ href = "", anchorDataId: _anchorDataId = "", docInfo, type } = {}) => {
        if ((0, linkPatternUtils_1.isMailtoUrl)(href)) {
          return href;
        }
        if (isDocumentHref(href)) {
          return (0, links_1.getDocumentLink)(docInfo.docId, docInfo.name);
        }
        const anchorDataId = typeof _anchorDataId === "string" ? _anchorDataId : _anchorDataId == null ? void 0 : _anchorDataId.id;
        if ((0, linkPatternUtils_1.isScrollTopOrBottomAnchor)(anchorDataId)) {
          return `#${TYPE_TO_ANCHOR_NAME[anchorDataId]}`;
        }
        const isExternalLink = type === "ExternalLink";
        if (isExternalLink) {
          return href;
        }
        return href;
      },
      getLinkProps: (url, target, rel) => {
        if ((0, linkPatternUtils_1.isMailtoUrl)(url)) {
          return getMailtoLinkProps(url);
        }
        if ((0, linkPatternUtils_1.isPhoneUrl)(url)) {
          return getPhoneLinkProps(url);
        }
        if ((0, linkPatternUtils_1.isAbsoluteUrl)(url)) {
          return getExternalLinkProps(url, target, rel);
        }
        if ((0, linkPatternUtils_1.isDocumentUrl)(url)) {
          return (0, links_1.getDocumentLinkProps)(url, metaSiteId, userFileDomainUrl, externalBaseUrl, isPremiumDomain, isResolveDocumentLinkEnabled);
        }
        throw new UnsupportedLinkTypeError2();
      },
      isDocumentHref
    };
  };
  sharedLinkUtils.createSharedLinkUtils = createSharedLinkUtils;
  return sharedLinkUtils;
}
var hasRequiredExternalLinkUtils;
function requireExternalLinkUtils() {
  if (hasRequiredExternalLinkUtils) return externalLinkUtils;
  hasRequiredExternalLinkUtils = 1;
  Object.defineProperty(externalLinkUtils, "__esModule", { value: true });
  externalLinkUtils.createExternalLinkUtils = void 0;
  const definition_1 = /* @__PURE__ */ requireDefinition();
  const sharedLinkUtils_1 = /* @__PURE__ */ requireSharedLinkUtils();
  const linkPatternUtils_1 = /* @__PURE__ */ requireLinkPatternUtils();
  const createExternalLinkUtils = (config, getService) => {
    const env = getService(definition_1.EnvironmentDefinition);
    const { isMobileView } = env;
    const metaSiteId = env.getMetaSiteId() ?? "unknown";
    const sharedUtils = (0, sharedLinkUtils_1.createSharedLinkUtils)({
      metaSiteId,
      isMobileView
    });
    return {
      isDynamicPage: () => {
        return false;
      },
      isAbsoluteUrl: linkPatternUtils_1.isAbsoluteUrl,
      getImpliedLink: sharedUtils.getImpliedLink,
      getImpliedLinks: sharedUtils.getImpliedLinks,
      getLink: sharedUtils.getLink,
      getLinkProps: sharedUtils.getLinkProps,
      getLinkUrlFromDataItem: () => {
        throw new Error(`getLinkUrlFromDataItem is not implemented`);
      }
    };
  };
  externalLinkUtils.createExternalLinkUtils = createExternalLinkUtils;
  return externalLinkUtils;
}
var internalLinkUtils = {};
var hasRequiredInternalLinkUtils;
function requireInternalLinkUtils() {
  if (hasRequiredInternalLinkUtils) return internalLinkUtils;
  hasRequiredInternalLinkUtils = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.isAbsoluteLink = exports$1.createInternalLinkUtils = void 0;
    const definition_1 = /* @__PURE__ */ requireDefinition();
    const links_1 = /* @__PURE__ */ requireLinks();
    const linkPatternUtils_1 = /* @__PURE__ */ requireLinkPatternUtils();
    const sharedLinkUtils_1 = /* @__PURE__ */ requireSharedLinkUtils();
    const ANCHOR_NAME_TO_TYPE = {
      top: "SCROLL_TO_TOP",
      bottom: "SCROLL_TO_BOTTOM"
    };
    const isDynamicPage = (routersConfig, pageUriSeo) => {
      if (routersConfig) {
        const [prefix] = pageUriSeo.replace("#", "/#").split(/[/]+/);
        const routersWithPrefixFromUrl = Object.values(routersConfig).filter((router) => router.prefix === prefix);
        return routersWithPrefixFromUrl.length === 1;
      }
      return false;
    };
    const getRouteWithPossibleTpaInnerRoute = (routes, relativePath) => {
      const decodedFullPathPageUriSeo = decodeURIComponent(relativePath);
      const fullPathPageRoute = `./${decodedFullPathPageUriSeo}`;
      if (routes[fullPathPageRoute]) {
        return [decodedFullPathPageUriSeo, ""];
      } else {
        const [pageUriSeo, ...tpaInnerRoute] = relativePath.split("/");
        const tpaInnerRoutePath = tpaInnerRoute.length > 0 ? `/${tpaInnerRoute.join("/")}` : "";
        return [pageUriSeo, tpaInnerRoutePath];
      }
    };
    const getPageRoute = (routingInfo, pageId) => {
      const pageRoute = Object.keys(routingInfo.routes).find((key) => {
        const route = routingInfo.routes[key];
        if (route.type === "Dynamic") {
          const pageIds = route.pageIds || [];
          return pageIds.includes(pageId);
        }
        return route.pageId === pageId;
      });
      if (pageRoute) {
        return removeLeadingDotFromRoute(pageRoute);
      }
      throw new Error(`No url route for pageId: ${pageId}`);
    };
    const removeLeadingDotFromRoute = (url) => url.replace(/^\.\//, "/");
    const removeTrailingSlashFromRoute = (url) => url.replace(/\/+$/, "");
    const concatPaths = (path1, path2) => {
      const path1WithoutTrailingSlash = path1.replace(/\/+$/, "");
      const path2WithoutLeadingSlash = path2.replace(/^\/+/, "");
      const joinedPath = `${path1WithoutTrailingSlash}/${path2WithoutLeadingSlash}`;
      return removeTrailingSlashFromRoute(joinedPath);
    };
    const createInternalLinkUtils = (config, getService) => {
      const { routingInfo, userFileDomainUrl, popupPages, getCompIdByWixCodeNickname, getRoleForCompId, routersConfig, multilingualInfo, isPremiumDomain } = config;
      const envService = getService(definition_1.EnvironmentDefinition);
      const metaSiteId = envService.getMetaSiteId() ?? "unknown";
      const isResolveDocumentLinkEnabled = envService.isExperimentOpen("specs.thunderbolt.resolveDocumentLink");
      const sharedLinkUtils2 = (0, sharedLinkUtils_1.createSharedLinkUtils)({
        metaSiteId,
        isMobileView: envService.isMobileView,
        userFileDomainUrl,
        externalBaseUrl: routingInfo.externalBaseUrl,
        isPremiumDomain,
        isResolveDocumentLinkEnabled
      });
      const isPopupId = (pageId) => popupPages ? popupPages[pageId] : false;
      const isDocumentHref = (href) => sharedLinkUtils2.isDocumentHref(href) || isPremiumDomain && href.startsWith((0, links_1.getBaseUrlFilesPath)(routingInfo.externalBaseUrl).href);
      const removeBaseUrlFromHref = (href) => href.replace(routingInfo.externalBaseUrl, "");
      const parsePageUrl = (url) => {
        var _a;
        const [, relativePath = "", anchor = "", queryString = ""] = linkPatternUtils_1.PAGE_URL_REGEXP.exec(url);
        const relativePageUrlPrefix = relativePath.replace(/\/+$/, "");
        const queryParams = new URLSearchParams(queryString);
        if (!(multilingualInfo == null ? void 0 : multilingualInfo.isOriginalLanguage) && ((_a = multilingualInfo == null ? void 0 : multilingualInfo.currentLanguage) == null ? void 0 : _a.resolutionMethod) === "QueryParam") {
          queryParams.set("lang", multilingualInfo.currentLanguage.languageCode);
        }
        return { relativePageUrlPrefix, anchor, queryString: queryParams.toString() };
      };
      const isDynamicPageUrl = (url) => {
        const { relativePageUrlPrefix } = parsePageUrl(url);
        return isDynamicPage(routersConfig, relativePageUrlPrefix);
      };
      const getHomePageRouteWithPageUriSEO = () => {
        const mainPageRoute = Object.keys(routingInfo.routes).find((key) => routingInfo.routes[key].pageId === routingInfo.mainPageId);
        return removeLeadingDotFromRoute(mainPageRoute);
      };
      const getPageLinkProps = (pageUrl, target = "_self", rel) => {
        const { relativePageUrlPrefix = "", anchor = "", queryString } = parsePageUrl(pageUrl);
        const anchorNickname = ANCHOR_NAME_TO_TYPE[anchor] || anchor;
        if (isPopupId(relativePageUrlPrefix)) {
          return {
            type: "PageLink",
            href: "",
            target: "_self",
            linkPopupId: relativePageUrlPrefix
          };
        }
        const externalBaseUrl = routingInfo.externalBaseUrl;
        let type;
        let href;
        let isSamePageNavigation;
        if (isDynamicPage(routersConfig, relativePageUrlPrefix)) {
          const relativeHref = `./${relativePageUrlPrefix}`;
          isSamePageNavigation = relativeHref === routingInfo.relativeUrl;
          type = "DynamicPageLink";
          href = `${externalBaseUrl}/${relativePageUrlPrefix}`;
        } else {
          const [pageUriSeoPath, maybeTpaInnerPath] = getRouteWithPossibleTpaInnerRoute(routingInfo.routes, relativePageUrlPrefix);
          const pageUriSeoInCurrentLang = routingInfo.pagesUriSEOs[pageUriSeoPath] || pageUriSeoPath;
          const pageRoute = `./${pageUriSeoInCurrentLang}`;
          const nextRouteConfig = pageRoute === "./" ? { pageId: routingInfo.mainPageId } : routingInfo.routes[pageRoute];
          const isHomePageNavigation = (nextRouteConfig == null ? void 0 : nextRouteConfig.pageId) === routingInfo.mainPageId;
          type = "PageLink";
          href = isHomePageNavigation && !maybeTpaInnerPath ? externalBaseUrl : `${externalBaseUrl}/${pageUriSeoInCurrentLang}${maybeTpaInnerPath}`;
          isSamePageNavigation = nextRouteConfig && nextRouteConfig.pageId === routingInfo.pageId;
        }
        const anchorCompId = anchorNickname && getCompIdByWixCodeNickname && getCompIdByWixCodeNickname(anchorNickname);
        const hasAnchorOnSamePage = isSamePageNavigation && anchorCompId;
        const hasAnchorOnOtherPage = anchorNickname && !hasAnchorOnSamePage;
        return {
          href: `${href}${queryString ? `?${new URLSearchParams(queryString).toString()}` : ""}`,
          target,
          rel,
          type,
          // if we have an anchor on the current page, we set the anchor compId
          ...hasAnchorOnSamePage && { anchorCompId },
          // if we have an anchor on another page, we set the anchor data item Id
          ...hasAnchorOnOtherPage && { anchorDataId: anchorNickname }
        };
      };
      const encodeInnerRoute = (innerRoute) => {
        const [innerRoutePath, stateQueryParams] = innerRoute.split("?");
        if (stateQueryParams) {
          const encodedQueryParams = encodeURIComponent(`?${stateQueryParams}`);
          return innerRoutePath ? `${innerRoutePath}${encodedQueryParams}` : encodedQueryParams;
        }
        return innerRoutePath;
      };
      const linkTypeToUrlResolverFn = {
        AnchorLink: (linkData) => {
          const { anchorDataId, pageId } = linkData;
          const isScrollTopOrBottom = (0, linkPatternUtils_1.isScrollTopOrBottomAnchor)(anchorDataId);
          const nextPageId = isScrollTopOrBottom ? routingInfo.pageId : pageId.replace(/^#/, "");
          const nextAnchorDataId = anchorDataId.startsWith("#") ? anchorDataId : `#${anchorDataId}`;
          const pageRoute = getPageRoute(routingInfo, nextPageId);
          return `${pageRoute}${nextAnchorDataId}`;
        },
        DocumentLink: (linkData) => {
          const { docId, name } = linkData;
          return (0, links_1.getDocumentLink)(docId, name);
        },
        ExternalLink: (linkData) => {
          const { url } = linkData;
          return url;
        },
        DynamicPageLink: (linkData) => {
          const { routerId, innerRoute, anchorDataId: _anchorDataId = "" } = linkData;
          const anchorDataId = _anchorDataId ?? "";
          const prefix = `/${routersConfig[routerId].prefix}`;
          const encodedInnerRoute = innerRoute ? encodeInnerRoute(innerRoute) : innerRoute;
          const suffix = encodedInnerRoute ? `/${encodedInnerRoute}${anchorDataId}` : anchorDataId;
          return `${prefix}${suffix}`;
        },
        TpaPageLink: (linkData) => {
          const { pageId, path = "" } = linkData;
          const _pageId = pageId.replace(/^#/, "");
          const prefix = routingInfo.pageIdToPrefix[_pageId];
          const pageUriSeo = routingInfo.pages[_pageId].pageUriSEO;
          const relativeUrl = prefix ? `/${prefix}/${pageUriSeo}` : `/${pageUriSeo}`;
          const encodedPath = encodeInnerRoute(path);
          if (encodedPath && routingInfo.isCustomizedUrl) {
            return prefix ? concatPaths(prefix, encodedPath) : encodedPath;
          }
          const isPathWithPageUriSEO = path.startsWith(relativeUrl);
          if (isPathWithPageUriSEO) {
            return encodedPath;
          }
          return concatPaths(relativeUrl, encodedPath);
        },
        PageLink: (linkData) => {
          const { pageId: pageIdOrData } = linkData;
          const pageId = ((typeof pageIdOrData === "string" ? pageIdOrData : pageIdOrData.id) || "").replace(/^#/, "");
          if (isPopupId(pageId)) {
            return `/${pageId}`;
          }
          if (pageId === routingInfo.mainPageId) {
            return "/";
          }
          return getPageRoute(routingInfo, pageId);
        },
        PhoneLink: (linkData) => (0, links_1.resolvePhoneLink)(linkData),
        EmailLink: (linkData) => (0, links_1.resolveEmailLink)(linkData)
      };
      return {
        isDynamicPage: isDynamicPageUrl,
        isAbsoluteUrl: linkPatternUtils_1.isAbsoluteUrl,
        getImpliedLink: sharedLinkUtils2.getImpliedLink,
        getImpliedLinks: sharedLinkUtils2.getImpliedLinks,
        getLink: ({ href: linkHref = "", linkPopupId, anchorCompId = "", anchorDataId = "", docInfo, type } = {}) => {
          if (linkPopupId) {
            return `/${linkPopupId}`;
          }
          if (isDocumentHref(linkHref)) {
            return (0, links_1.getDocumentLink)(docInfo.docId, docInfo.name);
          }
          const linkProps = { href: linkHref, linkPopupId, anchorDataId, docInfo, type };
          if ((0, exports$1.isAbsoluteLink)(metaSiteId, linkProps)) {
            return sharedLinkUtils2.getLink(linkProps);
          }
          const [href] = linkHref.split("?");
          const anchor = (getRoleForCompId == null ? void 0 : getRoleForCompId(anchorCompId, "wixCode")) || anchorDataId;
          const anchorId = anchor ? `#${anchor}` : "";
          const isHomePageUrl = href === routingInfo.externalBaseUrl;
          const link = isHomePageUrl ? getHomePageRouteWithPageUriSEO() : removeBaseUrlFromHref(href);
          return `${link}${anchorId}`;
        },
        getLinkProps: (url, target, rel) => {
          if ((0, linkPatternUtils_1.isSamePageAnchorUrl)(url)) {
            const relativeUrl = removeLeadingDotFromRoute(routingInfo.relativeUrl);
            const currentPageUriSEOWithAnchorUrl = `${relativeUrl}${url}`;
            return getPageLinkProps(currentPageUriSEOWithAnchorUrl, target);
          }
          if ((0, linkPatternUtils_1.isPageUrl)(url)) {
            return getPageLinkProps(url, target, rel);
          }
          if ((0, linkPatternUtils_1.isDocumentUrl)(url)) {
            return (0, links_1.getDocumentLinkProps)(url, metaSiteId, userFileDomainUrl, routingInfo.externalBaseUrl, isPremiumDomain, isResolveDocumentLinkEnabled);
          }
          return sharedLinkUtils2.getLinkProps(url, target, rel);
        },
        getLinkUrlFromDataItem: (linkData) => {
          const linkUrlResolverFn = linkTypeToUrlResolverFn[linkData.type];
          if (linkUrlResolverFn) {
            return linkUrlResolverFn(linkData);
          }
          throw new Error("Provided link type is not supported");
        }
      };
    };
    exports$1.createInternalLinkUtils = createInternalLinkUtils;
    const isAbsoluteLink = (metaSiteId, { href = "", anchorDataId: _anchorDataId = "", type }) => {
      const anchorDataId = typeof _anchorDataId === "string" ? _anchorDataId : _anchorDataId == null ? void 0 : _anchorDataId.id;
      return (0, linkPatternUtils_1.isMailtoUrl)(href) || type === "ExternalLink" || href.startsWith(`https://${metaSiteId}.filesusr.com/`) || (0, linkPatternUtils_1.isScrollTopOrBottomAnchor)(anchorDataId);
    };
    exports$1.isAbsoluteLink = isAbsoluteLink;
  })(internalLinkUtils);
  return internalLinkUtils;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist$2;
  hasRequiredDist = 1;
  (function(exports$1) {
    var __createBinding = dist$2 && dist$2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = dist$2 && dist$2.__exportStar || function(m, exports$12) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    __exportStar(/* @__PURE__ */ requireDefinition$1(), exports$1);
    __exportStar(/* @__PURE__ */ requireExternalLinkUtils(), exports$1);
    __exportStar(/* @__PURE__ */ requireInternalLinkUtils(), exports$1);
  })(dist$2);
  return dist$2;
}
var distExports = /* @__PURE__ */ requireDist();
const WIX_SDK_ERROR_TEXT = "Wix code SDK error:";
const reportError = (message) => {
  console.error(`${WIX_SDK_ERROR_TEXT} ${message}`);
};
const templates = {
  /* prettier-ignore */
  warning_not_null: ({ propertyName, functionName }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to null.`,
  /* prettier-ignore */
  warning_non_images_in_gallery: ({ galleryId }) => `Gallery "${galleryId}" cannot contain items that are not images. To also display video and text, choose a gallery that supports those types.`,
  /* prettier-ignore */
  warning_invalid_effect_name: ({ propertyName, compName, effectName, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it is an invalid effectName value. Read more about effects: "${infoLink}"')`,
  /* prettier-ignore */
  warning_invalid_effect_option: ({ propertyName, compName, effectName, effectOption, effectOptionRef }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it was called with the following invalid effectOptions keys: ${effectOption}. Read more about the effectOptions object: "https://www.wix.com/code/reference/$w.EffectOptions.html#${effectOptionRef}"`,
  /* prettier-ignore */
  warning_effect_options_not_set: ({ propertyName, compName, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the specified effect options because it was called without an effect. Read more about effects: "${infoLink}"')`,
  /* prettier-ignore */
  warning_invalid_effect_options: ({ propertyName, compName, effectName, wrongProperty, wrongValue, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because it was called with the following invalid effectOptions ${wrongProperty}: ${wrongValue}. Read more about the effectOptions object: "${infoLink}"')`,
  /* prettier-ignore */
  warning_deprecated_effect_name: ({ propertyName, compName, effectName, infoLink }) => `The "${propertyName}" function  called on "${compName}" was called with the following deprecated effect: "${effectName}". Read more about effects: "${infoLink}"')`,
  /* prettier-ignore */
  warning_deprecated_effect_with_options: ({ propertyName, compName, effectName, infoLink }) => `The "${propertyName}" function  called on "${compName}" was executed without the specified effect options because it was called with the following deprecated effect: "${effectName}". Read more about effects: "${infoLink}"`,
  /* prettier-ignore */
  warning_invalid_type_effect_options: ({ propertyName, compName, effectName, wrongValue, infoLink }) => `The "${propertyName}" function called on "${compName}" was executed without the "${effectName}" effect because the it was called with the following invalid effectOptions "${wrongValue}". The effectOptions must be of type Object. Read more about the effectOptions object: "${infoLink}"'`,
  /* prettier-ignore */
  error_bad_image_format_with_index: ({ propertyName, wrongValue, index }) => `The "${propertyName}" property of the item at index ${index} cannot be set to "${wrongValue}". It must be a valid URL starting with "http://", "https://", or "wix:image://".`,
  /* prettier-ignore */
  error_invalid_type_for_file_limit: ({ propertyName }) => `The ${propertyName} property is not yet supported for Document or Audio file types.`,
  /* prettier-ignore */
  warning_not_null_for_comp_name: ({ propertyName, functionName, compName }) => `The ${propertyName} parameter of "${compName}" that is passed to the ${functionName} method cannot be set to null.`,
  /* prettier-ignore */
  warning_not_null_with_index: ({ propertyName, functionName, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to null or undefined.`,
  /* prettier-ignore */
  warning_invalid_option: ({ propertyName, wrongValue, index }) => `The ${propertyName} parameter at index ${index} that is passed to the options function cannot be set to ${JSON.stringify(wrongValue)}. Options must contain either a non-null value or a non-null label.`,
  /* prettier-ignore */
  warning_duplicates_found: ({ propertyName, duplicateOptions }) => `The ${propertyName} parameter provided to the options function includes duplicate options. To avoid confusion, these duplicates have been automatically removed: ${JSON.stringify(duplicateOptions)}.`,
  /* prettier-ignore */
  warning_duplicates_values_found: ({ propertyName, duplicateOptions }) => `The ${propertyName} parameter provided to the options function includes duplicate options. Please remove the duplicates: ${JSON.stringify(duplicateOptions)}.`,
  /* prettier-ignore */
  warning_invalid_option_value: ({ propertyName, wrongValue, functionName }) => `The ${propertyName} parameter that is passed to the ${functionName} cannot be set to ${JSON.stringify(wrongValue)}. Ensure that the value is one of the available options in the array.`,
  /* prettier-ignore */
  warning_color_casting_performed: ({ propertyName, compName, infoLink }) => ` The value of "${propertyName}" property of "${compName}" expects an rgbColor value, but was set to an rgbaColor value. The color value has been set, but the alpha opacity information has been ignored. Read more about rgbColor values: "${infoLink}"`,
  /* prettier-ignore */
  warning_value_changed: ({ propertyName, compName, newValue, changedProperty }) => `The ${propertyName} of ${compName} was set to ${newValue}, which is less than ${compName}'s ${changedProperty} value. ${compName} cannot have a ${changedProperty} value which is greater than its ${propertyName} value. The value of ${changedProperty} has therefore been set to ${newValue}.`,
  /* prettier-ignore */
  warning_at_least: ({ propertyName, wrongValue, minValue }) => `The value of ${propertyName} property should not be set to the value ${wrongValue}. It should be at least ${minValue}.`,
  /* prettier-ignore */
  warning_at_most: ({ propertyName, wrongValue, maxValue }) => `The value of ${propertyName} property should not be set to the value ${wrongValue}. It should be at most ${maxValue}.`,
  /* prettier-ignore */
  error_mandatory_val: ({ propertyName, functionName }) => `The ${propertyName} parameter is required for ${functionName} method.`,
  /* prettier-ignore */
  error_mandatory_multiple_vals: ({ propertyNames, functionName }) => `The following parameters: ${[...propertyNames]}, are required for ${functionName} method.`,
  /* prettier-ignore */
  error_mandatory_val_with_index: ({ propertyName, functionName, index }) => `The ${propertyName} parameter of item at index ${index} is required for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_val: ({ propertyName, functionName }) => `The ${propertyName} parameter is not allowed for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_multiple_vals: ({ propertyNames, functionName }) => `The following parameters: ${[...propertyNames]} are unknown for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_val_with_index: ({ propertyName, functionName, index }) => `The ${propertyName} parameter of item at index ${index} is not allowed for ${functionName} method.`,
  /* prettier-ignore */
  error_unknown_multiple_vals_with_index: ({ propertyNames, functionName, index }) => `The following parameters: ${[...propertyNames]} of item at index ${index} are unknown for ${functionName} method.`,
  /* prettier-ignore */
  error_length_in_range: ({ propertyName, functionName, value, minimum, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_length_in_range_with_index: ({ propertyName, functionName, value, minimum, maximum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_length_accept_single_value: ({ propertyName, functionName, value, expectedValue }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be ${expectedValue}.`,
  /* prettier-ignore */
  error_length_accept_single_value_with_index: ({ propertyName, functionName, value, expectedValue, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". Its length must be ${expectedValue}.`,
  /* prettier-ignore */
  error_length_less_than: ({ propertyName, functionName, value, minimum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}" because its length is shorter than ${minimum}.`,
  /* prettier-ignore */
  error_length_less_than_with_index: ({ propertyName, functionName, value, minimum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}" because its length is shorter than ${minimum}.`,
  /* prettier-ignore */
  error_length_exceeds: ({ propertyName, functionName, value, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}" because its length exceeds ${maximum}.`,
  /* prettier-ignore */
  error_length_exceeds_with_index: ({ propertyName, functionName, value, maximum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}" because its length exceeds ${maximum}.`,
  /* prettier-ignore */
  error_range: ({ propertyName, functionName, value, minimum, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". It must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_range_with_index: ({ propertyName, functionName, value, minimum, maximum, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". It must be between ${minimum} and ${maximum}.`,
  /* prettier-ignore */
  error_accept_single_value: ({ propertyName, functionName, value, expectedValue }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value "${value}". It must be ${expectedValue}.`,
  /* prettier-ignore */
  error_accept_single_value_with_index: ({ propertyName, functionName, value, expectedValue, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${value}". It must be ${expectedValue}.`,
  /* prettier-ignore */
  error_larger_than: ({ propertyName, functionName, value, minimum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be larger than ${minimum}.`,
  /* prettier-ignore */
  error_at_least: ({ propertyName, functionName, value, minimum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be at least ${minimum}.`,
  /* prettier-ignore */
  error_larger_than_with_index: ({ propertyName, functionName, value, minimum, index }) => `The value of ${propertyName} parameter of item at ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be larger than ${minimum}.`,
  /* prettier-ignore */
  error_less_than: ({ propertyName, functionName, value, maximum }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be less than ${maximum}.`,
  /* prettier-ignore */
  error_less_than_with_index: ({ propertyName, functionName, value, maximum, index }) => `The value of ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be less than ${maximum}.`,
  /* prettier-ignore */
  error_type: ({ propertyName, functionName, value, expectedType }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. It must be of type ${expectedType}.`,
  /* prettier-ignore */
  error_type_with_index: ({ propertyName, functionName, value, expectedType, index }) => `The ${propertyName} parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${value}. It must be of type ${expectedType}.`,
  /* prettier-ignore */
  error_bad_format: ({ propertyName, functionName, value }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. Bad format`,
  /* prettier-ignore */
  error_effects_input: ({ functionName, wrongEffects, allowedEffects }) => `Passed  effects: "${wrongEffects.join('", "')}" to the ${functionName} method are wrong for this element. Allowed effects are: "${allowedEffects.join('", "')}".`,
  /* prettier-ignore */
  error_slide_input: ({ propertyName, functionName, slideShowId, value, minimum, maximum }) => `The "${propertyName}" parameter that is passed to the "${functionName}" method cannot be set to the value ${value}. It must be a slide from the "${slideShowId}" slideshow or an index between ${minimum} and ${maximum}`,
  /* prettier-ignore */
  error_state_input: ({ propertyName, functionName, stateBoxId, value }) => `The "${propertyName}" parameter that is passed to the "${functionName}" method cannot be set to the value ${value}. It must be a state from the "${stateBoxId}" statebox`,
  /* prettier-ignore */
  error_bad_format_with_index: ({ propertyName, functionName, value, index }) => `The "${propertyName}" property of the item at index ${index} that is passed to the ${functionName} method cannot be set to "${value}". Bad format`,
  /* prettier-ignore */
  error_bad_format_with_hint: ({ propertyName, functionName, wrongValue, hint }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. Bad format, must be ${hint} format.`,
  /* prettier-ignore */
  error_object_bad_format: ({ keyName, propertyName, functionName, wrongValue, message }) => `The value of ${keyName} in ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. ${message}`,
  /* prettier-ignore */
  error_object_bad_format_with_index: ({ keyName, propertyName, index, functionName, wrongValue, message }) => `The value of ${keyName} of item at index ${index} in ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. ${message}`,
  /* prettier-ignore */
  error_bad_svg_format: ({ propertyName, value }) => `The "${propertyName}" property cannot be set to "${value}". It must be a valid SVG XML string or an SVG source starting with "http://", "https://", or "wix:vector://v1/".`,
  /* prettier-ignore */
  error_target_w_photo: ({ target }) => `The target parameter that is passed to the target method cannot be set to the value ${target}. It must be of type from (_blank,_self).`,
  /* prettier-ignore */
  error_invalid_rel: ({ rel, validKeywords }) => `The rel parameter that is passed to the rel method cannot be set to the value ${rel}. It must be a space-separated list of unique keywords (${validKeywords.join()}).`,
  /* prettier-ignore */
  error_menu_items_target: ({ target, label, index }) => `The target parameter of the item with the label ${label} nested under the item at index ${index} that is passed to the target method cannot be set to the value ${target}. It must be of type from (_blank, _self).`,
  /* prettier-ignore */
  error_menu_items_id_pattern: ({ id, label, index }) => `The id parameter of the item with the label ${label} nested under the item at index ${index} that is passed to the id method cannot be set to the value ${id}. It must consist of letters, numbers, or dashes.`,
  /* prettier-ignore */
  error_menu_items_id_uniqueness: ({ id }) => `The menuItems parameter that is passed to the menuItems method cannot be set to the given value, as the id value ${id} already exists. Each menu item id must be unique.`,
  /* prettier-ignore */
  error_menu_items_depth: ({ labelValue, maxLevels }) => `The menuItems parameter with the label "${labelValue}" that is passed to the menuItems method cannot be nested at this level. Menus can be ${maxLevels} levels deep.`,
  /* prettier-ignore */
  error_menu_items_label: ({ index }) => `The value of the label parameter of the item at index ${index} that is passed to the label cannot be set to the value undefined, null, or an empty string, unless a label can be inferred from the item link's page title.`,
  /* prettier-ignore */
  error_bad_menu_item_format: ({ propertyName, value }) => `The "${propertyName}" property cannot be set to "${value}". It must be a valid URL starting with "http://", "https://", "image://", "wix:image://v1" or "wix:vector://v1/svgshape.v2".`,
  /* prettier-ignore */
  error_bad_menu_item_format_with_index: ({ propertyName, value, index }) => `The "${propertyName}" property of the item at index ${index} cannot be set to "${value}". It must be a valid URL starting with "http://", "https://", "image://", "wix:image://v1" or "wix:vector://v1/svgshape.v2"`,
  /* prettier-ignore */
  error_invalid_css_value: ({ propertyName, compName, cssProperty, exampleFormat, infoLink }) => ` The "${propertyName}" property of "${compName}" was set to an invalid "${cssProperty}" value. The value is expected in the following format:"${exampleFormat}". Read more about "${cssProperty}" values: "${infoLink}"`,
  /* prettier-ignore */
  error_invalid_css_value_multiple_expected_formats: ({ propertyName, compName, cssProperty, exampleFormats, infoLink }) => ` The "${propertyName}" property of "${compName}" was set to an invalid "${cssProperty}" value. The value is expected in one of the following formats:"${exampleFormats}". Read more about "${cssProperty}" values: "${infoLink}"`,
  /* prettier-ignore */
  error_invalid_location: ({ propertyName, index, wrongValue }) => `The ${propertyName} parameter at index ${index} that is passed to the markers function cannot be set to ${wrongValue}. You need to set either location object {longitude, latitude}, or a valid address - placeId.`,
  /* prettier-ignore */
  error_invalid_markers: ({ wrongValue }) => `The markers property cannot be set to ${wrongValue}. You need to set at least one marker in the array.`,
  /* prettier-ignore */
  error_only_getter: ({ propertyName, compType }) => `Cannot set property ${propertyName} of ${compType} which has only a getter.`,
  /* prettier-ignore */
  error_invalid_url: ({ url, type, prefix }) => `The "src" property cannot be set to "${url}". It must be a valid URL starting with "http://", "https://", or a valid ${type} URL starting with ${prefix}.`,
  /* prettier-ignore */
  error_supported_link_type_with_index: ({ functionName, wrongValue, index }) => `The link property of item at index ${index} that is passed to the ${functionName} method cannot be set to the value "${wrongValue}" as this is not a supported link type.`,
  /* prettier-ignore */
  error_invalid_target_with_index: ({ functionName, wrongValue, index }) => `The target parameter of item at index ${index} that is passed to the ${functionName} method cannot be set to the value ${wrongValue}. It must be of type from (_blank,_self).`,
  /* prettier-ignore */
  warning_unsupported_function_for_type: ({ functionName, type }) => `'${functionName}' is not supported for an element of type: ${type}.`,
  /* prettier-ignore */
  error_bad_iana_timezone: ({ timeZoneIANA }) => `Invalid IANA time zone specified: "${timeZoneIANA}"`,
  /* prettier-ignore */
  error_invalid_option_fields: ({ propertyName, wrongValue, fields, index }) => `The ${propertyName} at index ${index} cannot be set to ${JSON.stringify(wrongValue)}. Options must contain at least a non-null ${fields[0]} or a non-null ${fields[1]}.`,
  /* prettier-ignore */
  error_item_external_link: ({ propertyName, functionName, index }) => `The ${propertyName} of the ${functionName} parameter of item at index ${index} that is passed to the items method cannot be an external link. It must be a link to a page on your site.`,
  /* prettier-ignore */
  error_unsupported_property_with_hint: ({ propertyName, hint }) => `The ${propertyName} parameter cannot be set when ${hint}`,
  /* prettier-ignore */
  error_item_not_found: ({ propertyName, functionName, value }) => `The ${propertyName} parameter with value ${value} that is passed to the ${functionName} method is not found.`,
  /* prettier-ignore */
  error_array_length: ({ propertyName, functionName, value, arrayLength }) => `The value of ${propertyName} parameter that is passed to the ${functionName} method cannot be set to the value ${value}. Its length must be at least ${arrayLength}.`,
  /* prettier-ignore */
  error_unsupported_chars: ({ propertyName, functionName }) => `The ${propertyName} parameter that is passed to the ${functionName} method contains invalid characters.`,
  /* prettier-ignore */
  error_values_not_unique: ({ propertyName, functionName, wrongValue }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to ${JSON.stringify(wrongValue)}. Options must contain unique value properties.`,
  /* prettier-ignore */
  error_invalid_indice_value: ({ propertyName, invalidValue }) => `The ${propertyName} parameter cannot be set to ${JSON.stringify(invalidValue)}. Ensure that the options array contains at least one option before applying ${propertyName}.`,
  /* prettier-ignore */
  error_none_value_unavailable: ({ propertyName, functionName, value }) => `The ${propertyName} parameter that is passed to the ${functionName} method cannot be set to ${value} value. Add none item to the ${functionName} list, or set ${propertyName} to existing value`,
  /* prettier-ignore */
  warning_item_value_not_found: ({ propertyName, functionName, value }) => `The ${propertyName} parameter with value ${value} that is passed to the ${functionName} method is not found.`,
  /* prettier-ignore */
  error_bad_link_format: ({ url, propertyName }) => `The ${propertyName} property that is passed to the ${propertyName} method cannot be set to the value "${url}" as this is not a supported link type.`,
  /* prettier-ignore */
  warning_icon_not_animated: ({ propertyName }) => `The animated icon is not set in the settings panel, so the ${propertyName} method will not have any effect.`
};
const nilAssignmentMessage = ({ compName, functionName, propertyName, index }) => {
  if (isNumber$1(index)) {
    return templates.warning_not_null_with_index({
      propertyName,
      functionName,
      index
    });
  }
  if (compName) {
    return templates.warning_not_null_for_comp_name({
      compName,
      functionName,
      propertyName
    });
  }
  return templates.warning_not_null({ functionName, propertyName });
};
const unsupportedLinkType = ({ functionName, wrongValue, index }) => {
  return templates.error_supported_link_type_with_index({
    functionName,
    wrongValue,
    index
  });
};
class NilAssignmentError extends Error {
  constructor(params) {
    const message = nilAssignmentMessage(params);
    super(message);
    this.name = "NilAssignmentError";
    this.message = message;
  }
}
class UnsupportedLinkTypeError extends Error {
  constructor(params) {
    const message = unsupportedLinkType(params);
    super(message);
    this.name = "UnsupportedLinkTypeError";
    this.message = message;
  }
}
class InvalidLabelError extends NilAssignmentError {
  constructor(index) {
    super({
      functionName: "menuItems",
      propertyName: "label",
      index
    });
    this.name = "InvalidLabelError";
  }
}
class InvalidIdPatternError extends Error {
  constructor({
    index,
    label,
    id
  }) {
    super(
      templates.error_menu_items_id_pattern({
        index,
        label,
        id
      })
    );
    this.name = "InvalidIdPatternError";
  }
}
class NonUniqueIdError extends Error {
  constructor({ id }) {
    super(templates.error_menu_items_id_uniqueness({ id }));
    this.name = "NonUniqueIdError";
  }
}
class InvalidTargetError extends Error {
  constructor({
    index,
    label,
    target
  }) {
    super(
      templates.error_menu_items_target({
        index,
        label,
        target
      })
    );
    this.name = "InvalidTargetError";
  }
}
class InvalidMenuDepthError extends Error {
  constructor(maxLevels, labelValue) {
    super(
      templates.error_menu_items_depth({
        labelValue,
        maxLevels
      })
    );
    this.name = "InvalidMenuDepth";
  }
}
class LinkTypeError extends UnsupportedLinkTypeError {
  constructor(wrongValue, index) {
    super({
      functionName: "menuItems",
      propertyName: "link",
      wrongValue,
      index
    });
  }
}
const idPattern = /^[a-zA-Z\d-]*$/;
const validateIdPattern = (items, parentIndex) => {
  items == null ? void 0 : items.every(({ id, link = "", label = link, menuItems }, index) => {
    if (id && !idPattern.test(id)) {
      throw new InvalidIdPatternError({
        index: parentIndex === void 0 ? index : parentIndex,
        label,
        id
      });
    }
    return validateIdPattern(menuItems, index);
  });
};
const validateIdUniqueness = (items) => {
  const ids = getItemIds(items || []);
  const duplicatedId = findDuplicate(ids);
  if (duplicatedId !== void 0) {
    throw new NonUniqueIdError({ id: duplicatedId });
  }
};
const getItemIds = (menuItems) => {
  return menuItems.reduce(
    (agg, curr) => {
      return [
        ...agg,
        ...isString$1(curr.id) ? [curr.id] : [],
        ...curr.menuItems ? getItemIds(curr.menuItems) : []
      ];
    },
    []
  );
};
const findDuplicate = (arr) => {
  return arr.find((value, idx) => {
    return idx !== arr.lastIndexOf(value);
  });
};
const validateMenuItemsId = (menuItems) => {
  try {
    validateIdUniqueness(menuItems);
    validateIdPattern(menuItems);
  } catch (error) {
    reportError(error.message);
    return false;
  }
  return true;
};
const validateMenuItemsTarget = (value) => {
  if (!value) {
    return true;
  }
  const checkMenuItemsTarget = (items, parentIndex) => (items == null ? void 0 : items.every(({ target, link = "", label = link, menuItems }, index) => {
    if (target != null && target !== "_blank" && target !== "_self") {
      throw new InvalidTargetError({
        index: parentIndex === void 0 ? index : parentIndex,
        label,
        target
      });
    }
    return checkMenuItemsTarget(menuItems, index);
  })) ?? true;
  try {
    return checkMenuItemsTarget(value);
  } catch (error) {
    reportError(error.message);
    return false;
  }
};
const validateMenuItemsDepth = (maxLevels) => (value) => {
  if (!value) {
    return true;
  }
  const checkMenuItemsLevel = ({
    currentLevel,
    items
  }) => {
    if (!items) {
      return true;
    }
    if (items.length === 0) {
      return true;
    } else if (currentLevel < 0) {
      return false;
    }
    return items.every(({ menuItems, label, link }) => {
      const hasMenuItems = typeof menuItems !== "undefined";
      if (!hasMenuItems) {
        return true;
      }
      const isValidMenuItems = checkMenuItemsLevel({
        items: menuItems,
        currentLevel: currentLevel - 1
      });
      if (!isValidMenuItems) {
        throw new InvalidMenuDepthError(maxLevels + 1, label || link || "");
      }
      return isValidMenuItems;
    });
  };
  return value.every(({ menuItems, label, link }) => {
    try {
      const result = checkMenuItemsLevel({
        items: menuItems,
        currentLevel: maxLevels - 1
      });
      if (result === false) {
        throw new InvalidMenuDepthError(maxLevels + 1, label || link || "");
      }
    } catch (error) {
      reportError(error.message);
      return false;
    }
    return true;
  });
};
const pageUrlRegex = /^\/([^ ?#]*)[?]?(.*)/;
const isPageUrl = (url) => pageUrlRegex.test(url);
const getLink = ({
  link,
  target,
  linkUtils
}) => {
  if (!isNil$1(link)) {
    const passedTarget = target;
    return linkUtils.getLinkProps(link, passedTarget);
  }
  return {};
};
const getPageTitleFromUrl = (url, pageList) => {
  var _a;
  const key = url.slice(1);
  if (pageList.hasOwnProperty(key)) {
    return (_a = pageList[key]) == null ? void 0 : _a.title;
  }
  return void 0;
};
const getLabel = ({
  link,
  label,
  pageList
}) => {
  if (!isNil$1(label)) {
    return label;
  }
  if (!isNil$1(link) && isPageUrl(link)) {
    return getPageTitleFromUrl(link, pageList);
  }
  return void 0;
};
const validators = [
  validateMenuItemsDepth(1),
  validateMenuItemsTarget,
  validateMenuItemsId
];
const validateMenuItems = (menuItems) => {
  let isValid = true;
  isValid = validators.every((validator) => validator(menuItems));
  return isValid;
};
const getMenuItems = (linkUtils, pageList, items) => {
  if (isArray$1(items)) {
    return items.map(
      (menuItem, i) => createMenuDataItem(menuItem, i, linkUtils, pageList)
    );
  }
  return [];
};
const createMenuDataItem = (menuDataItem, index, linkUtils, pageList) => {
  const menuSdkItem = {};
  try {
    const linkData = getLink({
      linkUtils,
      link: menuDataItem.link,
      target: menuDataItem.target || "_self"
    });
    if (linkData.href) {
      menuSdkItem.link = linkData.href;
      menuSdkItem.target = linkData.target || "_self";
    }
  } catch (error) {
    throw new LinkTypeError(menuDataItem.link || "", index);
  }
  const label = getLabel({
    label: menuDataItem.label,
    link: menuDataItem.link,
    pageList
  });
  if (isNil$1(label)) {
    throw new InvalidLabelError(index);
  }
  if (!isNil$1(menuDataItem.id)) {
    menuSdkItem.id = menuDataItem.id;
  }
  menuSdkItem.label = label;
  if (!isNil$1(menuDataItem.selected)) {
    menuSdkItem.selected = menuDataItem.selected;
  }
  return {
    ...menuSdkItem,
    menuItems: getMenuItems(linkUtils, pageList, menuDataItem.menuItems)
  };
};
const createMenuSdk = (api) => {
  const { props, setProps, getService } = api;
  const linkUtils = getService(distExports.LinkUtilsDefinition);
  return {
    get type() {
      return "$w.Menu";
    },
    get menuItems() {
      var _a, _b, _c;
      const menuDataItems = ((_c = (_b = (_a = props.elementProps) == null ? void 0 : _a.navbar) == null ? void 0 : _b.items) == null ? void 0 : _c.map(
        transformPropDataToSdkData
      )) ?? [];
      return (menuDataItems == null ? void 0 : menuDataItems.map(
        (menuItem, i) => (
          // TODO: get pageList from sdkData
          createMenuDataItem(menuItem, i, linkUtils, {})
        )
      )) ?? [];
    },
    set menuItems(menuDataItems) {
      const isValidMenuItems = validateMenuItems(menuDataItems);
      if (!isValidMenuItems) {
        return;
      }
      const updatedMenuItems = (menuDataItems == null ? void 0 : menuDataItems.map(
        (menuItem, i) => (
          // TODO: get pageList from sdkData
          createMenuDataItem(menuItem, i, linkUtils, {})
        )
      ).map(transformSdkDataToPropData)) ?? [];
      setProps({
        elementProps: {
          ...props.elementProps,
          navbar: { ...props.elementProps.navbar, items: updatedMenuItems }
        }
      });
    },
    onItemMouseIn: (handler) => registerCorvidMouseEvent(
      "onItemMouseIn",
      api,
      handler,
      (payload) => ({
        item: transformPropDataToSdkData(payload),
        type: "itemMouseIn"
      })
    ),
    onItemMouseOut: (handler) => registerCorvidMouseEvent(
      "onItemMouseOut",
      api,
      handler,
      (payload) => ({
        item: transformPropDataToSdkData(payload),
        type: "itemMouseOut"
      })
    ),
    onItemClick: (handler) => registerCorvidMouseEvent(
      "onItemClick",
      api,
      handler,
      (payload) => ({
        item: transformPropDataToSdkData(payload),
        type: "itemMouseClick"
      })
    ),
    onItemDblClick: (handler) => registerCorvidMouseEvent(
      "onItemDblClick",
      api,
      handler,
      (payload) => ({
        item: transformPropDataToSdkData(payload),
        type: "itemMouseDblClick"
      })
    )
  };
};
const sdk = composeSDKFactories([
  createMenuSdk,
  createA11ySdk({ a11yProperty: "a11y" })
]);
export {
  sdk as default
};
//# sourceMappingURL=script-asset-3f27c3f4-5a2b-4b2c-9b14-05d9c0c6d5ec-sdk.ch.B9OTcyWf.js.map
