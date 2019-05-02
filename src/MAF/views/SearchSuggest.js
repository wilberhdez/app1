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
 * @class MAF.views.SearchSuggest
 * @extends MAF.system.SidebarView
 */
define('MAF.views.SearchSuggest', function () {
	var maskValue = function (value) {
		var bullet = this.config.bulletCharacter;
		var domask = this.config.secureMask;
		var masktype = domask && this.config.secureMaskType;
		var masked = bullet.repeat(value.length);
		if (masktype && masked.length) {
			switch (masktype) {
				case 'mask-characer':
					// mask all but last character
					masked = bullet.repeat(value.length - 1) + value.charAt(value.length - 1);
					break;
				case 'mask-submitted':
					// expose full value on overlay
					masked = value;
					break;
				case 'mask-all':
					// keep value on overlay fully masked
					break;
				default:
					// no masking
					masked = value;
					break;
			}
		} else {
			masked = value;
		}
		return masked;
	};

	return new MAF.Class({
		ClassName: 'SearchSuggestView',

		Extends: MAF.system.SidebarView,

		Protected: {
			showResultsGrid: function () {
				this.hideNoResults();
				if (!this.controls.grid.visible) {
					this.controls.grid.show();
				}
				if (!this.controls.indic.visible) {
					this.controls.indic.show();
				}
			},
			showNoResults: function () {
				this.hideResultsGrid();
				if (!this.elements.noResultsIcon.visible) {
					this.elements.noResultsIcon.show();
				}
				if (!this.elements.noResultsText.visible) {
					this.elements.noResultsText.show();
				}
			},
			hideResultsGrid: function () {
				if (this.controls.grid.visible) {
					this.controls.grid.hide();
				}
				if (this.controls.indic.visible) {
					this.controls.indic.hide();
				}
			},
			hideNoResults: function () {
				if (this.elements.noResultsIcon.visible) {
					this.elements.noResultsIcon.hide();
				}
				if (this.elements.noResultsText.visible) {
					this.elements.noResultsText.hide();
				}
			}
		},

		config: {
			BackButtonTitle: 'BACK',
			SearchButtonTitle: 'SEARCH',
			NoResultsMessage: 'NO_RESULTS',
			Cursor: '_',
			DisplayDefaultValue: '',
			AutocompleteThreshold: 3,
			GridRows: 6,
			GridColumns: 1,
			bulletCharacter: '\u2022',
			secureMask: false,
			secureMaskType: 'mask-submitted',
			formBackgroundColor: '#000',
			keyboard: {
				startFocused: true,
				maxLength: 15
			}
		},

		valueManagerUpdate: function (event) {
			var value = this.elements.valueManager.value;
			var cursorPosition = this.elements.valueManager.cursorPosition;
			var el = this.controls.keyOutput.element;
			var nativeCursor = false;//this._isCursorSupported();
			var cursor = false;
			var displayValue = maskValue.call(this, value);

			if (!nativeCursor) {
				cursor = this.config.Cursor;
				displayValue = displayValue.substring(0, cursorPosition) + cursor + displayValue.substring(cursorPosition, displayValue.length);
			}

			this.controls.keyOutput.setText(displayValue);

			if (nativeCursor && el.cursor && el.cursor.visible) {
				el.cursor.position = cursorPosition || 0;
			}

			this.hideNoResults();

			if (value.length >= this.config.AutocompleteThreshold && event && event.type && event.type === 'valuechanged') {
				this.performAutocomplete(value);
			} else {
				if (value.length === 0) {
					value = this.config.DisplayDefaultValue;
				}
				this.hideResultsGrid();
			}
		},

		createView: function () {
			this.elements.valueManager = new MAF.keyboard.KeyboardValueManager({
				maxLength: this.config.keyboard.maxLength
			});
			this.valueManagerUpdate.subscribeTo(this.elements.valueManager, ['cursormoved', 'valuechanged'], this);
			this.elements.valueManager.cursorPosition = this.elements.valueManager.value.length;

			this.controls.backButton = new MAF.control.BackButton({
				label: widget.getLocalizedString(this.config.BackButtonTitle)
			}).appendTo(this);

			this.controls.grid = new MAF.control.Grid({
				guid: this.config.viewId + '.grid',
				rows: this.config.GridRows,
				columns: this.config.GridColumns,
				styles: Theme.getStyles('SearchSuggestResultGrid'),
				cellCreator: function () {
					return new MAF.control.GridCell({
						content: this.getView().cellContentCreator(),
						events: {
							onSelect: function (event) {
								this.getView().performRowSelected(event.payload.dataItem);
							}
						}
					});
				},
				cellUpdater: function(cell, dataitem) {
					this.getView().cellContentUpdater(cell.content, dataitem);
				}
			}).appendTo(this);

			this.controls.indic = new MAF.control.PageIndicator({
				guid: this.config.viewId + '.indicator',
				styles: {
				    vOffset: this.controls.grid.outerHeight
				}
			}).appendTo(this).attachToSource(this.controls.grid);

			this.controls.submitButton = new MAF.control.TextButton({
				label: widget.getLocalizedString(this.config.SearchButtonTitle),
				styles: {
					vAlign: 'bottom'
				},
				events: {
					onSelect: function (event) {
						var view = this.getView();
						view.performSearch(view.elements.valueManager.value);
					}
				}
			}).appendTo(this);

			this.controls.keyboardContainer = new MAF.element.Container({
				styles: {
					width: this.width,
					height: this.height - this.controls.indic.outerHeight - this.controls.submitButton.height,
					vAlign: 'bottom',
					vOffset: this.controls.submitButton.height
				}
			}).appendTo(this);

			var clearStyles = Theme.get('ControlTextEntryOverlayClearButton', 'styling') || {};
			this.controls.clearButton = new MAF.element.Button({
				ClassName: 'ControlTextEntryOverlayClearButton',
				content: new MAF.element.Text({
					label: FontAwesome.get('times'),
					styles: {
						width: '100%',
						height: '100%',
						anchorStyle: 'center'
					}
				}),
				guid: this.config.viewId + '.clearButton',
				styles: clearStyles,
				events: {
					onSelect: function () {
						this.getView().elements.valueManager.value = '';
					},
					onNavigate: function (event) {
						switch (event.payload.direction) {
							case 'right':
								event.preventDefault();
								break;
							case 'left':
								//if (!this.getView()._isCursorSupported()) {
								//event.preventDefault();
								//}
								break;
						}
					}
				}
			}).appendTo(this.controls.keyboardContainer);

			this.controls.textHighlight = new MAF.element.Container({
				ClassName: 'ControlTextEntryOverlayTextHighlight',
				focus: false
			}).appendTo(this.controls.keyboardContainer);

			this.controls.textHighlight.hide();

			this.controls.keyOutput = new MAF.element.TextField({
				ClassName: 'ControlTextEntryButtonValue',
				guid: this.config.viewId + '.keyOutput',
				label: '',
				focus: true,
				styles: {
					width: this.width - (clearStyles.width || 0) - 20
				},
				events: {
					onKeyDown: function (event) {
						var view = this.getView();
						if (event.KFEvent && (event.KFEvent.keyCode == 13)) {
							view._onSubmit(event);
						} else {
							event.payload.layout = view.controls.keyCaps.config.layout;
							view.elements.valueManager.handleExternalKeyInput(event);
						}
					},
					onFocus: function (event) {
						var view = this.getView();
						if (!view.controls.keyOutput.element.allowCursor) {
							event.preventDefault();
							view.controls.clearButton.focus();
						} else {
							view.controls.textHighlight.show();
						}
					},
					onBlur: function () {
						var view = this.getView();
						if (view.controls.keyOutput.element.allowCursor) {
							view.controls.textHighlight.hide();
						}
					},
					onNavigate: function (event) {
						var view = this.getView();
						switch (event.payload.direction) {
							case 'left':
								event.preventDefault();
								view.elements.valueManager.moveCursorLeft();
								break;
							case 'right':
								if (view.elements.valueManager.cursorPosition < view.elements.valueManager.value.length) {
									event.preventDefault();
									view.elements.valueManager.moveCursorRight();
								}
								break;
						}
					}
				}
			}).appendTo(this.controls.keyboardContainer);

			this.controls.keyOutput.element.addClass('ControlTextEntryButtonValueTheme');

			var cursorStyles = Theme.get('ControlTextEntryButtonValue', 'cursor');
/*			if (this._isCursorSupported()) {
				this.controls.keyOutput.element.allowCursor = true;
				this.controls.keyOutput.element.cursor.color = cursorStyles.color;
				this.controls.keyOutput.element.cursor.width = cursorStyles.width;
				this.controls.keyOutput.element.cursor.visible = false;
			}*/

			this.controls.outputLabel = new MAF.element.Text({
				ClassName: 'ControlTextEntryButtonLabel',
				label: widget.getLocalizedString(this.config.label)
			}).appendTo(this.controls.keyboardContainer);
			//this.controls.outputLabel.setStyles(this.controls.outputLabel.config.ClassName);
			this.controls.outputLabel.setStyles({ width: 0, height: 0 });

			this.elements.keyCaps = new MAF.control.Keyboard({
				id: this.config.viewId + '.keyCaps',
				embedded: false,
				maxLength: this.config.keyboard.maxLength || 255,
				layout: getSetting('keyboard') || 'alphanumeric',
				controlSize: 'standard',
				styles: {
					width: this.width,
					vAlign: 'bottom'
				},
				events: {
					onKeyDown: function (event) {
						var view = this.getView();
						event.payload.layout = view.elements.keyCaps.config.layout;
						view.elements.valueManager.handleExternalKeyInput(event);
						if (event.KFEvent && view._isCursorSupported() && !view.controls.keyOutput.element.hasFocus) {
							view.controls.keyOutput.focus();
						}
					}
				}
			}).appendTo(this.controls.keyboardContainer);

			this.elements.noResultsIcon = new MAF.element.Text({
				label: FontAwesome.get(Theme.get('SearchSuggestNoResultsIcon', 'icon')),
				styles: Theme.getStyles('SearchSuggestNoResultsIcon')
			}).appendTo(this);

			this.elements.noResultsText = new MAF.element.Text({
				label: widget.getLocalizedString(this.config.NoResultsMessage),
				styles: Object.merge(Theme.getStyles('SearchSuggestNoResultsText'),{wrap: true})
			}).appendTo(this);

			this.controls.keyboardContainer.renderSkin('ControlTextEntryOverlay');

		//	this.elements.keyCaps.setStyle('vOffset', (this.controls.keyboardContainer.height - Theme.get('ControlTextEntryButton').submitButtonPadding));
		},

		updateView: function () {
			this.valueManagerUpdate();
		},

		focusView: function () {
			if (this.element.focusedView === null) {
				this.elements.keyCaps.focus();
			}
			this.elements.keyCaps.focus();
		},

		cellContentCreator: function () {
			return new MAF.element.Text({
				styles: Object.merge(Theme.getStyles('SearchSuggestResultGridText'), { width: '90%', truncation: 'end', vOffset: 15, hOffset: 10 })
			});
		},

		cellContentUpdater: function (content, dataitem) {
			content.setText(dataitem.label);
		},

		dataReady: function (items, showEmpty) {
			if (!items || (items.length < 1)) {
				if (showEmpty) {
					this.showNoResults();
				}
				return;
			}
			this.controls.grid.changeDataset(items, true);
			this.showResultsGrid();
		},

		performRowSelected: function () {
			throw new Error('There is no point in having a Search Suggest control if you will do nothing with what the user selected, so implement this method!');
		},

		performAutocomplete: function (input) {
			this.performSearch(input);
		},

		performSearch: function () {
			throw new Error('There is no point in having a Search Suggest control if you will do nothing with what the user selected, so implement this method!');
		}
	});
}, {
	SearchSuggestView: 'SidebarView',
	SearchSuggestNoResultsIcon: {
		icon: 'search',
		styles: {
			visible: false,
			width: 550,
			color: '#FFFFFF',
			fontSize: 120,
			vOffset: 151,
			textAlign: 'center'
		}
	},
	SearchSuggestNoResultsText: {
		styles: {
			visible: false,
			color: '#FFFFFF',
			vOffset: 351,
			width: 550,
			fontSize: 32,
			textAlign: 'center',
			hAlign: 'center'
		}
	},
	SearchSuggestResultGrid: {
		styles: {
			width: '100%',
			height: 360,
			vOffset: 52
		}
	},
	ControlTextEntryOverlayTextHighlight: {

	}
});
