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
 * @class MAF.control.TabPipeButton
 * @extends MAF.control.TabStripButton
 */
define('MAF.control.TabPipeButton', function () {
	return new MAF.Class({
		ClassName: 'ControlTabPipeButton',

		Extends: MAF.control.TabStripButton
	});
}, {
	ControlTabPipeButton: 'ControlTabStripButton',
	ControlTabPipeButtonText: 'ControlTabStripButtonText',
	ControlTabPipeButtonImage: 'ControlTabStripButtonImage'
});
