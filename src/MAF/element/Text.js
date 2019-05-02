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
 * @class MAF.element.Text
 * @extends MAF.element.Core
 */

/**
 * @cfg {String} anchorStyle Controls how the text is aligned in the component.
 * @memberof MAF.element.Text
 */
/**
 * @cfg {String} data The text that the component will display.
 * @memberof MAF.element.Text
 */
/**
 * @cfg {Number} firstLine First line of text.
 * @memberof MAF.element.Text
 */
/**
 * @cfg {Object} styles CSS styles for the component:
 * @param {String} truncation Indicate if the should truncate when it does not fit the component. It will not truncate by default, use 'end' to turn it on. If truncation is allowed all HTML tags will be stripped from the text.
 * @param {Boolean} wrap Display text in a single line or wrap the text. When setting the wrap property the styles.width config is required. Default is false.
 * @memberof MAF.element.Text
 */
/**
 * @cfg {Number} totalLines Total lines of text.
 * @memberof MAF.element.Text
 */
/**
 * @cfg {Number} visibleLines Number of text lines visible.
 * @memberof MAF.element.Text
 */
/**
 * Fired when a change happened.
 * @event MAF.element.Text#onChange
 */
/**
 * Fired when a the layout of the component has changed.
 * @event MAF.element.Text#onLayoutChange
 */
define('MAF.element.Text', function () {
	return new MAF.Class({
		ClassName: 'BaseText',

		Extends: MAF.element.Core,

		Protected: {
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				switch(event.type) {
					case 'change':
						this.fire('onChange', payload, event);
						break;
					case 'layoutchange':
						this.fire('onLayoutChange', payload, event);
						break;
				}
			},
			registerEvents: function (eventTypes) {
				this.parent(['change', 'layoutchange'].concat(eventTypes || []));
			},
			proxyProperties: function (propnames) {
				this.parent([
					'data',
					'text',
					'size',
					'scrolling',
					'truncation',
					'wrap',
					'font',
					'lineHeight',
					'totalLines',
					'maxVisibleLindex',
					'visibleLines',
					'firstLine',
					'anchorStyle',
					'color',
					'textWidth',
					'textHeight'
				].concat(propnames || []));
			}
		},

		config: {
			element: Text
		},

		initialize: function () {
			this.config.anchorStyle = this.config.styles && this.config.styles.anchorStyle || this.config.anchorStyle;
			if (this.config.styles) {
				delete this.config.styles.anchorStyle;
			}
			if ('wrap' in this.config || 'truncation' in this.config) {
				if (!this.config.styles) {
					this.config.styles = {};
				}
				this.config.styles.wrap = 'wrap' in this.config.styles ? this.config.styles.wrap : this.config.wrap;
				this.config.styles.truncation = 'truncation' in this.config.styles ? this.config.styles.truncation : this.config.truncation;
				delete this.config.wrap;
				delete this.config.truncation;
			}

			this.parent();
			if (this.config.anchorStyle) {
				this.anchorStyle = this.config.anchorStyle;
			}
			if (this.config.visibleLines) {
				this.visibleLines = this.config.visibleLines;
			}
			this.setText(this.config.data || this.config.text || this.config.label);
		},

		/**
		 * Set which text to display on this component.
		 * @param {String} text The text
		 * @method MAF.element.Text#setText
		 */
		setText: function (text) {
			this.element.data = text;
		},

		/**
		 * Get which text is displayed on this component.
		 * @method MAF.element.Text#getText
		 */
		getText: function () {
			return this.element.data || '';
		}
	});
});
