import {
  getSelectionCustomInlineStyle,
  toggleCustomInlineStyle,
} from "draftjs-utils";
import PropTypes from "prop-types";
import { Component } from "react";

import LayoutComponent from "./Component";

class ColorPicker extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state = {
    expanded: false,
    currentColor: undefined,
    currentBgColor: undefined,
  };

  constructor(props) {
    super(props);
    const { editorState } = props;
    const state = {
      expanded: false,
      currentColor: undefined,
      currentBgColor: undefined,
    };
    if (editorState) {
      state.currentColor = getSelectionCustomInlineStyle(editorState, [
        "COLOR",
      ]).COLOR;
      state.currentBgColor = getSelectionCustomInlineStyle(editorState, [
        "BGCOLOR",
      ]).BGCOLOR;
    }
    this.state = state;
  }

  componentDidMount() {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentDidUpdate(prevProps) {
    const { editorState } = this.props;
    if (editorState && editorState !== prevProps.editorState) {
      this.setState({
        currentColor: getSelectionCustomInlineStyle(editorState, ["COLOR"])
          .COLOR,
        currentBgColor: getSelectionCustomInlineStyle(editorState, ["BGCOLOR"])
          .BGCOLOR,
      });
    }
  }

  componentWillUnmount() {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  onExpandEvent = () => {
    this.signalExpanded = !this.state.expanded;
  };

  expandCollapse = () => {
    this.setState({
      expanded: this.signalExpanded,
    });
    this.signalExpanded = false;
  };

  doExpand = () => {
    this.setState({
      expanded: true,
    });
  };

  doCollapse = () => {
    this.setState({
      expanded: false,
    });
  };

  toggleColor = (style, color) => {
    const { editorState, onChange } = this.props;
    const newState = toggleCustomInlineStyle(editorState, style, color);
    if (newState) {
      onChange(newState);
    }
    this.doCollapse();
  };

  render() {
    const { config, translations } = this.props;
    const { currentColor, currentBgColor, expanded } = this.state;
    const ColorPickerComponent = config.component || LayoutComponent;
    const color = currentColor?.substring(6);
    const bgColor = currentBgColor?.substring(8);
    return (
      <ColorPickerComponent
        config={config}
        translations={translations}
        onChange={this.toggleColor}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        currentState={{ color, bgColor }}
      />
    );
  }
}

export default ColorPicker;
