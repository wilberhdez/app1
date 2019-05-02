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
 * @class MAF.dialogs.Login
 * @extends MAF.dialogs.BaseDialogImplementation
 */
 /**
 * @cfg {String} title Title of the dialog.
 * @memberof MAF.dialogs.Login
 */
 /**
 * @cfg {String} message Message to be displayed inside the dialog.
 * @memberof MAF.dialogs.Login
 */
 /**
 * @cfg {Function} callback Function to call when dialog completes.
 * @memberof MAF.dialogs.Login
 */
 /**
 * @cfg {Function} cancelCallback Function to call on cancelation of dialog.
 * @memberof MAF.dialogs.Login
 */
define('MAF.dialogs.Login', function () {
	return new MAF.Class({
		ClassName: 'LoginDialog',

		Extends: MAF.dialogs.BaseDialogImplementation,

		config: {
			title: '',
			message: '',
			callback: null,
			cancelCallback: null
		},

		initialize: function () {
			this.parent();
		},

		getDialogConfig: function() {
			return { type: 'login', conf: { 'ignoreBackKey': this.config.isModal, key: this.retrieve('key'), title: this.config.title, message: this.config.message } };
		},

		handleCallback: function (response) {
			if (response.cancelled) {
				if (this.config.cancelCallback && this.config.cancelCallback.call) {
					this.config.cancelCallback(response);
				}
			} else {
				if (this.config.callback && this.config.callback.call) {
					this.config.callback(response);
				}
			}
		}
	});
});
