import React, { PureComponent } from "react";
import { ViewPropTypes, NativeModules } from "react-native";
import PropTypes from "prop-types";

import RNVectorHelper from "./RNVectorHelper";

const { RNBottomActionSheet } = NativeModules;

class SheetView extends PureComponent {

  static propTypes = {
    ...ViewPropTypes,

    title: PropTypes.string,
    theme: PropTypes.string,

    selection: PropTypes.number,
    titleTextColor: PropTypes.string,
    itemTextColor: PropTypes.string,
    itemTintColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    delayDismissOnItemClick: PropTypes.bool,
    visible: PropTypes.bool
  };

  static defaultProps = {
    title: '',
    theme: 'light',

    selection: -1,
    titleTextColor: '',
    itemTextColor: '',
    itemTintColor: '',
    backgroundColor: '',
    delayDismissOnItemClick: false,
    visible: false
  };

  static Show(props) {
    const {
      title = SheetView.defaultProps.title,
      items = SheetView.defaultProps.items,
      theme = SheetView.defaultProps.theme,
      selection = SheetView.defaultProps.selection,
      titleTextColor = SheetView.defaultProps.titleTextColor,
      itemTintColor = SheetView.defaultProps.itemTintColor,
      itemTextColor = SheetView.defaultProps.itemTextColor,
      backgroundColor = SheetView.defaultProps.backgroundColor,
      delayDismissOnItemClick = SheetView.defaultProps.delayDismissOnItemClick,
      onSelection,
      onCancel,
    } = props;

    const newItems = items.map(item => {
      const newItem = {
        title: '',
        subTitle: '',
        divider: false,
        ...item,
      };
      if (item.icon && item.icon.props) {
        const { family, name } = item.icon.props;
        newItem.icon = Object.assign(
          {},
          item.icon.props,
          RNVectorHelper.Resolve(family, name)
        );
      } else if (item.icon !== undefined) {
        newItem.icon = {
          name: item.icon,
          family: '',
          glyph: '',
          color: '',
          size: 0,
        };
      } else {
        newItem.icon = {}
      }
      return newItem;
    })

    RNBottomActionSheet.SheetView(
      {
        title,
        items: newItems,
        theme,
        selection,
        titleTextColor,
        itemTextColor,
        itemTintColor,
        backgroundColor,
        delayDismissOnItemClick,
      },
      selectedIndex => {
        const selectedValue = newItems[selectedIndex].value
        onSelection && onSelection(selectedIndex, selectedValue)
      },
      () => {
        onCancel && onCancel()
      }
    );
  }

  componentDidMount() {
    this._show();
  }

  componentDidUpdate() {
    this._show();
  }

  _show() {
    if (this.props.visible) {
      let props = this.props
      let items = []

      React.Children.map(
        this.props.children,
        (item, index) => {
          items.push({
            title: item.props.title,
            subTitle: item.props.subTitle,
            icon: item.props.icon,
            divider: item.props.divider === undefined ? '' : item.props.divider
          })
        }
      )

      SheetView.Show(Object.assign({}, props, { items: items }));
    }
  }

  render() {
    return null;
  }
}

class Item extends PureComponent { }

Item.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  divider: PropTypes.bool,

  icon: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object
  ])
}

Item.defaultProps = {
  title: '',
  subTitle: '',
  divider: false
}

SheetView.Item = Item

export { SheetView };
