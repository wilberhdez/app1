/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
/** 
 * Container extends MAF.element.Core
 * @class MAF.element.Container
 * @extends MAF.element.Core
 * @param {object} config
 * @mixes Library.Themes
 */

/**
 * Fired when the component recieves focus.
 * @event MAF.element.Container#onFocus
 */
/**
 * Fired when the component is blurred.
 * @event MAF.element.Container#onBlur
 */
/**
 * Fired when the component is selected.
 * @event MAF.element.Container#onSelect
 */
/**
 * Fired when a navigation happens when the component has focus.
 * @event MAF.element.Container#onNavigate
 */
/**
 * Fired when this component changes it state to enabled.
 * @event MAF.element.Grid#onEnable
 */
/**
 * Fired when this component changes it state to disabled.
 * @event MAF.element.Grid#onDisable
 */
/**
 * Fired when this component changes it enabled or disabled state.
 * @event MAF.element.Grid#onChangeDisabled
 */
define('MAF.element.Container', function () {
	return new MAF.Class({
		ClassName: 'BaseContainer',

		Extends: MAF.element.Core,

		Implements: Library.Themes,

		Protected: {
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				var type = event.type,
					el = this.element;
				switch(type) {
					case 'navigate':
						this.fire('onNavigate', event.detail, event);
						return;
					default:
						break;
				}
				this.fire('on' + type.capitalize(), payload, event);
			},
			registerEvents: function (types) {
				this.parent(['focus', 'blur', 'select', 'navigate'].concat(types || []));
			},
			proxyProperties: function (propnames) {
				this.parent(propnames);
				getter(this, 'disabled', function () {
					return this.element && this.element.disabled;
				});
				setter(this, 'disabled', function (disabled) {
					disabled = disabled || false;
					var el = this.element;
					if (this.disabled !== disabled) {
						this.fire(disabled ? 'onDisable' : 'onEnable');
						if (el) el.disabled = disabled;
						this.fire('onChangeDisabled', {
							disabled: disabled
						});
					}
				});
			}
		},

		initialize: function () {
			this.parent();
			this.element.wantsFocus = this.config.focus;
			if (this.config.content) {
				this.content = this.config.content;
				if (this.config.content.element) {
					this.adopt(this.content);
				} else if (this.config.content.length) {
					this.adopt.apply(this, this.content);
				}
				this.config.content = null;
				delete this.config.content;
			}
		},
		/**
		 * This will try and focus this component. If it cannot recieve focus, this focus will stay on the currently focused component.
		 * @method MAF.element.Container#focus
		 */
		focus: function () {
			if (this.element.hasFocus) {
				return true;
			}
			if (this.element.focusable) {
				this.element.focus();
			}
			return (this.element.hasFocus === true);
		},

		suicide: function () {
			if (this.content) {
				this.content = [].concat(this.content);
				while(this.content.length) {
					this.content.pop().suicide();
				}
				delete this.content;
			}
			this.parent();
		}
	});
}, {
	BaseGlow: {
		applyLayer: function (frame, args, theme) {
			if (!frame.hasClass('BaseGlow')) {
				frame.addClass('BaseGlow');
				return frame;
			}
			return;
		},
		styles: {
			backgroundColor: 'rgba(0,0,0,.5)'
		}
	},
	BaseHighlight: {
		applyLayer: function (frame, args, theme) {
			return;
		},
		styles: {
		}
	},
	BaseFocus: {
		applyLayer: function (frame, args, theme) {
			if (!frame.hasClass('BaseFocus')) {
				frame.addClass('BaseFocus');
				return frame;
			}
			return;
		},
		styles: {
			backgroundColor: 'red'
		}
	},
	BaseActive: {
		applyLayer: function (frame, args, theme) {
			if (!frame.hasClass('BaseActive')) {
				frame.addClass('BaseActive');
				return frame;
			}
			return;
		},
		styles: {
			backgroundColor: 'rgba(255,0,0,.5)'
		}
	}
});
