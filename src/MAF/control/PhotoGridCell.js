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
 * @class MAF.control.PhotoGridCell
 * @classdesc This is a grid cell that has a default styling asuming it only will display 1 image/photo.
 * @extends MAF.control.GridCell
 */
define('MAF.control.PhotoGridCell', function () {
	var fitPhoto = function () {
		var cw = this.width,
			ch = this.height,
			sz = Math.min(cw, ch) - (this.config.cellPadding || 0) * 2;
		this.photo.aspectSizeMax(sz);
		this.photo.show();
	};

	return new MAF.Class({
		ClassName: 'ControlPhotoGridCell',

		Extends: MAF.control.GridCell,

		config: {
			cellPadding: 16
		},

		initialize: function () {
			this.parent();

			this.photo = new MAF.element.Image({
				ClassName: 'ControlPhotoHolderImage',
				hideWhileLoading: true,
				autoShow: false,
				styles: {
					hAlign: 'center',
					vAlign: 'center'
				}
			}).appendTo(this);

			fitPhoto.subscribeTo(this.photo, 'onLoaded', this);
			this.photo.setSources(this.config);
		},

		/**
		 * Set the sources of the this component.
		 * @param {Object} object Can contain src/missingSrc image path.
		 * ```
		 * image.setSources({
		 *    src: 'path/to/image.png',
		 *    missingSrc: 'path/to/missing.png'
		 * })
		 * ```
		 * @method MAF.control.PhotoGridCell#setSources
		 */
		setSources: function (sources) {
			return this.photo.setSources(sources);
		},

		/**
		 * Set the src config of this component with a new image path.
		 * @param {String} source Path of the image.
		 * @method MAF.control.PhotoGridCell#setSource
		 */
		setSource: function (source) {
			return this.photo.setSource(source);
		}
	});
}, {
	ControlPhotoGridCell: 'ControlGridCell',
	ControlPhotoHolderImage: {
		styles: {
			border: '2px solid white'
		}
	}
});
