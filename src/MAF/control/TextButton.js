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
 * @class MAF.control.TextButton
 * @extends MAF.control.Button
 * @example
 * 		var button3 = new MAF.control.TextButton({
			label: 'Text Button'
			events: {
				onSelect: function () {
					log('Button has been selected.');
				}
			}
		}).appendTo(this);
 */
define('MAF.control.TextButton', function () {
	return new MAF.Class({
		ClassName: 'ControlTextButton',

		Extends: MAF.control.Button,

		createContent: function () {
			this.content = new MAF.element.Text({
				ClassName: (this.config.ClassName || this.ClassName) + 'Text',
				label: this.config.label,
				styles: this.config.textStyles
			}).appendTo(this);
		},

		/**
		 * Set which text to display on this component.
		 * @param {String} text The text
		 * @method MAF.control.TextButton#setText
		 */
		setText: function (text) {
			this.content.setText(text);
		},

		/**
		 * Get which text is displayed on this component.
		 * @method MAF.control.TextButton#getText
		 */
		getText: function () {
			return this.content.getText() || '';
		}
	});
}, {
	ControlTextButton: 'ControlButton',
	ControlTextButtonText: {
		styles: {
			width: '100%',
			height: 'inherit',
			paddingLeft: 10,
			paddingRight: 10,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
