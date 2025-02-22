import React, {Component} from 'react';
import {View} from 'react-native';
// @ts-expect-error
import {shouldUpdate, extractComponentProps} from '../../../component-updater';
import styleConstructor from './style';
import Dot, {DotProps} from '../dot';

export enum MarkingTypes {
  DOT = 'dot',
  MULTI_DOT = 'multi-dot',
  PERIOD = 'period',
  MULTI_PERIOD = 'multi-period',
  CUSTOM = 'custom'
}

type DOT = {
  key?: string;
  color?: string;
  selectedDotColor?: string;
};

type PERIOD = {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
};

interface MarkingProps extends DotProps {
  type?: MarkingTypes;
  theme?: Object;
  selected?: boolean;
  marked?: boolean;
  today?: boolean;
  disabled?: boolean;
  disableTouchEvent?: boolean;
  activeOpacity?: number;
  selectedColor?: string;
  selectedTextColor?: string;
  dotColor?: string;
  //multi-dot
  dots?: DOT;
  //multi-period
  periods?: PERIOD;
}

export default class Marking extends Component<MarkingProps> {
  static displayName = 'IGNORE';

  static markingTypes = MarkingTypes;
  style: any;

  constructor(props: MarkingProps) {
    super(props);

    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps: MarkingProps) {
    return shouldUpdate(this.props, nextProps, [
      'type',
      'selected',
      'marked',
      'today',
      'disabled',
      'disableTouchEvent',
      'activeOpacity',
      'selectedColor',
      'selectedTextColor',
      'dotColor',
      'dots',
      'periods'
    ]);
  }

  getItems(items: DOT | PERIOD) {
    const {type} = this.props;

    if (items && Array.isArray(items) && items.length > 0) {
      // Filter out items so that we process only those which have color property
      const validItems = items.filter(d => d && d.color);

      return validItems.map((item, index) => {
        return type === MarkingTypes.MULTI_DOT ? this.renderDot(index, item) : this.renderPeriod(index, item);
      });
    }
  }

  renderMarkingByType() {
    const {type, dots, periods} = this.props;
    switch (type) {
      case MarkingTypes.MULTI_DOT:
        return this.renderMultiMarkings(this.style.dots, dots);
      case MarkingTypes.MULTI_PERIOD:
        return this.renderMultiMarkings(this.style.periods, periods);
      default:
        return this.renderDot();
    }
  }

  renderMultiMarkings(containerStyle: Object, items: any) {
    return <View style={containerStyle}>{this.getItems(items)}</View>;
  }

  renderPeriod(index: number, item: any) {
    const {color, startingDay, endingDay} = item;
    const style = [
      this.style.period,
      {
        backgroundColor: color
      }
    ];
    if (startingDay) {
      style.push(this.style.startingDay);
    }
    if (endingDay) {
      style.push(this.style.endingDay);
    }
    return <View key={index} style={style} />;
  }

  renderDot(index?: number, item?: any) {
    const {selected, dotColor} = this.props;
    const dotProps = extractComponentProps(Dot, this.props);
    let key = index;
    let color = dotColor;

    if (item) {
      if (item.key) {
        key = item.key;
      }
      color = selected && item.selectedDotColor ? item.selectedDotColor : item.color;
    }

    return <Dot {...dotProps} key={key} color={color} />;
  }

  render() {
    return this.renderMarkingByType();
  }
}
