import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

// The values that can be used as sizes for an [MdcIcon].
export enum IconSize {
  DefaultSize = 24,
  xSmall = 12,
  small = 13,
  medium = 16,
  large = 18,
  xLarge = 20,
}

@Directive({
  selector: 'mdc-icon',
})
export class MdcIcon implements OnChanges, OnInit {
  private _previousFontSetClass: string;
  private _previousFontIconClass: string;
  private _previousfontSize: IconSize;

  @Input() fontSet: string = 'material-icons';
  @Input() fontIcon: string;
  @Input() fontSize: IconSize = IconSize.DefaultSize;
  @HostBinding('class.material-icons') get classMaterialIcon(): string {
    return this.fontSet === 'material-icons' ? 'material-icons' : '';
  }

  constructor(
    private _renderer: Renderer2,
    public elementRef: ElementRef) {
    _renderer.setAttribute(elementRef.nativeElement, 'aria-hidden', 'true');
  }

  ngOnChanges(changes: SimpleChanges) {
    const fontSize = changes['fontSize'] ? changes['fontSize'].currentValue : this.fontSize;
    const fontSet = changes['fontSet'] ? changes['fontSet'].currentValue : this.fontSet;
    const fontIcon = changes['fontIcon'] ? changes['fontIcon'].currentValue : this.fontIcon;
    this._updateFontIconClasses(fontSet, fontIcon, fontSize);
  }

  ngOnInit() {
    this._updateFontIconClasses(this.fontSet, this.fontIcon, this.fontSize);
  }

  private _updateFontIconClasses(fontSet: string | null, fontIcon: string | null, fontSize: IconSize): void {
    const elem = this.elementRef.nativeElement;

    if (fontSet !== this._previousFontSetClass) {
      if (this._previousFontSetClass) {
        this._renderer.removeClass(elem, this._previousFontSetClass);
      }
      if (fontSet) {
        this._renderer.addClass(elem, fontSet);
      }
      this._previousFontSetClass = fontSet;
    }

    if (this.fontIcon !== this._previousFontIconClass) {
      if (this._previousFontIconClass) {
        this._renderer.removeClass(elem, this._previousFontIconClass);
      }
      if (this.fontIcon) {
        for (let iconClass of this.fontIcon.split(" ")) {
          this._renderer.addClass(elem, iconClass);
        }
      }
      this._previousFontIconClass = this.fontIcon;
    }

    if (this.fontSize) {
      if (this.fontSize !== this._previousfontSize) {
        this._renderer.setStyle(this.elementRef.nativeElement, 'font-size', `${IconSize[fontSize]}px`);
      }
    }
  }
}
