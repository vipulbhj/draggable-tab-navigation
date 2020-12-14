import { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tab from "./Tab";
import Alert from "../Alert";
import "./style.css";

class ScrollableTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          title: "Tab1",
          content: "Tab 1 Content",
        },
        {
          title: "Tab2",
          content: "Tab 2 Content",
        },
        {
          title: "Tab3",
          content: "Tab 3 Content",
        },
      ],
      selectedTabIdx: 0,
      isAlertVisible: false,
    };
    this.tabNumber = 4;
    this.removedTabTitle = null;
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = this.reorder(
      this.state.tabs,
      result.source.index,
      result.destination.index
    );

    this.setState({
      tabs: items,
    });
  };

  moveToPreviousTab = (e) => {
    const selectedTabIdx = this.state.selectedTabIdx;
    let updatedIdx = selectedTabIdx - 1;
    if (updatedIdx >= 0 && updatedIdx < this.state.tabs.length) {
      this.setState({
        selectedTabIdx: updatedIdx,
      });
    }
  };

  moveToNextTab = (e) => {
    const selectedTabIdx = this.state.selectedTabIdx;
    let updatedIdx = selectedTabIdx + 1;
    if (updatedIdx >= 0 && updatedIdx < this.state.tabs.length) {
      this.setState({
        selectedTabIdx: updatedIdx,
      });
    }
  };

  selectTab = (idx) => {
    this.setState({
      selectedTabIdx: idx,
    });
  };

  addNewTab = () => {
    // Can make more than 10 tabs.
    if (this.state.tabs.length >= 10) return;

    const tabEntity = {
      title: `Tab${this.tabNumber}`,
      content: `Tab ${this.tabNumber} Content`,
    };

    // prettier-ignore
    this.setState(state => {
      return {
        tabs: [...state.tabs, tabEntity]
      }
    }, () => {
      ++this.tabNumber;
    });
  };

  removeTab = (idx) => {
    const tabs = [...this.state.tabs];
    const tab = tabs.splice(idx, 1);
    this.removedTabTitle = tab[0].title;

    const selectedTabIdx = this.state.selectedTabIdx;
    let updatedIdx =
      selectedTabIdx > 0 && selectedTabIdx > idx
        ? selectedTabIdx - 1
        : selectedTabIdx;

    this.setState({
      tabs,
      isAlertVisible: true,
      selectedTabIdx: updatedIdx,
    });
  };

  render() {
    return (
      <nav>
        {this.state.isAlertVisible && (
          <Alert
            message={this.removedTabTitle}
            onClose={() => {
              this.setState({
                isAlertVisible: false,
              });
            }}
          />
        )}

        {
          // prettier-ignore
          this.state.selectedTabIdx !== 0 ? (
            <div className="chevron" onClick={this.moveToPreviousTab}>&lt;</div>
          ) : null
        }

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                }}
              >
                {this.state.tabs.map((tab, idx) => {
                  const isSelected = this.state.selectedTabIdx === idx;
                  return (
                    <Draggable
                      key={tab.title}
                      draggableId={tab.title}
                      index={idx}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            flexShrink: 0,
                            width: "20%",
                            padding: 0,
                          }}
                        >
                          <Tab
                            key={idx}
                            title={tab.title}
                            isSelected={isSelected}
                            onClose={(e) => {
                              e.stopPropagation();
                              this.removeTab(idx);
                            }}
                            selectTab={() => this.selectTab(idx)}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {
          // prettier-ignore
          this.state.selectedTabIdx !== (this.state.tabs.length - 1) ? (
            <div className="chevron" onClick={this.moveToNextTab}>&gt;</div>
          ) : null
        }
        <div className="chevron" onClick={this.addNewTab}>
          &#43;
        </div>
      </nav>
    );
  }
}

export default ScrollableTabs;
