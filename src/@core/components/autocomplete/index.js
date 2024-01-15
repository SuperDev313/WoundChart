// ** React Imports
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState, useRef } from "react";

// ** Third Party Components
import PropTypes from "prop-types";
import classnames from "classnames";
import { AlertCircle } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";

// ** Hooks Imports
import { useOnClickOutside } from "@hooks/useOnClickOutside";

// ** Styles Imports
import "@styles/base/bootstrap-extended/_include.scss";
import "./autocomplete.scss";

const Autocomplete = (props) => {
  // ** Refs
  const container = useRef(null);
  const inputElRef = useRef(null);
  const suggestionsListRef = useRef(null);

  // ** States
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState(props.value ? props.value : "");

  // ** Vars
  const navigate = useNavigate();
  let filteredData = [];

  // ** Suggestion Item Click Event
  const onSuggestionItemClick = (url, e) => {
    setActiveSuggestion(0);
    setShowSuggestions(false);
    setUserInput(filteredData[activeSuggestion][props.filterKey]);
    if (url !== undefined && url !== null) {
      navigate(url);
    }

    if (props.onSuggestionClick) {
      props.onSuggestionClick(url, e);
    }
  };

  // ** Suggestion Hover Event
  const onSuggestionItemHover = (index) => {
    setActiveSuggestion(index);
  };

  // ** Input On Change Event
  const onChange = (e) => {
    const userInput = e.currentTarget.value;
    setActiveSuggestion(0);
    setShowSuggestions(true);
    setUserInput(userInput);
    if (e.target.value < 1) {
      setShowSuggestions(false);
    }
  };

  // ** Input Click Event
  const onInputClick = (e) => {
    e.stopPropagation();
  };

  // ** Input's Keydown Event
  const onKeyDown = (e) => {
    const filterKey = props.filterKey;
    const suggestionList = ReactDOM.findDOMNode(suggestionsListRef.current);

    // ** User pressed the up arrow
    if (e.keyCode === 38 && activeSuggestion !== 0) {
      setActiveSuggestion(activeSuggestion - 1);

      if (
        e.target.value.length > -1 &&
        suggestionList !== null &&
        activeSuggestion <= filteredData.length / 2
      ) {
        suggestionList.scrollTop = 0;
      }
    } else if (e.keyCode === 40 && activeSuggestion < filteredData.length - 1) {
      // ** User pressed the down arrow
      setActiveSuggestion(activeSuggestion + 1);

      if (
        e.target.value.length > -1 &&
        suggestionList !== null &&
        activeSuggestion >= filteredData.length / 2
      ) {
        suggestionList.scrollTop = suggestionList.scrollHeight;
      }
    } else if (e.keyCode === 27) {
      // ** User Pressed ESC
      setShowSuggestions(false);
      setUserInput("");
    } else if (e.keyCode === 13 && showSuggestions) {
      // ** User Pressed ENTER
      onSuggestionItemClick(filteredData[activeSuggestion].link, e);
      setUserInput(filteredData[activeSuggestion][filterKey]);
      setShowSuggestions(false);
    } else {
      return;
    }

    // ** Custom Keydown Event
    if (props.onKeyDown !== undefined && props.onKeyDown !== null) {
      props.onKeyDown(e, userInput);
    }
  };

  // ** Function To Render Grouped Suggestions
  const renderGroupedSuggestion = (arr) => {
    const { filterKey, customRender } = props;

    const renderSuggestion = (item, i) => {
      if (!customRender) {
        const suggestionURL =
          item.link !== undefined && item.link !== null ? item.link : null;
        return (
          <li
            className={classnames("suggestion-item", {
              active: filteredData.indexOf(item) === activeSuggestion,
            })}
            key={item[filterKey]}
            onClick={(e) => onSuggestionItemClick(suggestionURL, e)}
            onMouseEnter={() => {
              onSuggestionItemHover(filteredData.indexOf(item));
            }}
          >
            {item[filterKey]}
          </li>
        );
      } else if (customRender) {
        return customRender(
          item,
          i,
          filteredData,
          activeSuggestion,
          onSuggestionItemClick,
          onSuggestionItemHover,
          userInput
        );
      } else {
        return null;
      }
    };

    return arr.map((item, i) => {
      return renderSuggestion(item, i);
    });
  };

  // ** Function To Render Ungrouped Suggestions
  const renderUngroupedSuggestions = () => {
    const { filterKey, suggestions, customRender, suggestionLimit } = props;

    filteredData = [];
    const sortSingleData = suggestions
      .filter((i) => {
        const startCondition = i[filterKey]
            .toLowerCase()
            .startsWith(userInput.toLowerCase()),
          includeCondition = i[filterKey]
            .toLowerCase()
            .includes(userInput.toLowerCase());
        if (startCondition) {
          return startCondition;
        } else if (!startCondition && includeCondition) {
          return includeCondition;
        } else {
          return null;
        }
      })
      .slice(0, suggestionLimit);
    filteredData.push(...sortSingleData);
    if (sortSingleData.length) {
      return sortSingleData.map((suggestion, index) => {
        const suggestionURL =
          suggestion.link !== undefined && suggestion.link !== null
            ? suggestion.link
            : null;
        if (!customRender) {
          return (
            <li
              className={classnames("suggestion-item", {
                active: filteredData.indexOf(suggestion) === activeSuggestion,
              })}
              key={suggestion[filterKey]}
              onClick={(e) => onSuggestionItemClick(suggestionURL, e)}
              onMouseEnter={() =>
                onSuggestionItemHover(filteredData.indexOf(suggestion))
              }
            >
              {suggestion[filterKey]}
            </li>
          );
        } else if (customRender) {
          return customRender(
            suggestion,
            index,
            filteredData,
            activeSuggestion,
            onSuggestionItemClick,
            onSuggestionItemHover,
            userInput
          );
        } else {
          return null;
        }
      });
    } else {
      return (
        <li className="suggestion-item no-result">
          <AlertCircle size={15} />
          <span className="align-middle ms-50">No Result</span>
        </li>
      );
    }
  };

  // ** Function To Render Suggestions
  const renderSuggestions = () => {
    const { filterKey, grouped, filterHeaderKey, suggestions } = props;

    // ** Checks if suggestions are grouped or not.
    if (grouped === undefined || grouped === null || !grouped) {
      return renderUngroupedSuggestions();
    } else {
      filteredData = [];
      return suggestions.map((suggestion) => {
        const sortData = suggestion.data
          .filter((i) => {
            const startCondition = i[filterKey]
                .toLowerCase()
                .startsWith(userInput.toLowerCase()),
              includeCondition = i[filterKey]
                .toLowerCase()
                .includes(userInput.toLowerCase());
            if (startCondition) {
              return startCondition;
            } else if (!startCondition && includeCondition) {
              return includeCondition;
            } else {
              return null;
            }
          })
          .slice(0, suggestion.searchLimit);

        filteredData.push(...sortData);
        return (
          <Fragment key={suggestion[filterHeaderKey]}>
            <li className="suggestion-item suggestion-title-wrapper">
              <h6 className="suggestion-title">
                {suggestion[filterHeaderKey]}
              </h6>
            </li>
            {sortData.length ? (
              renderGroupedSuggestion(sortData)
            ) : (
              <li className="suggestion-item no-result">
                <AlertCircle size={15} />
                <span className="align-middle ms-50">No Result</span>
              </li>
            )}
          </Fragment>
        );
      });
    }
  };

  //** ComponentDidMount
  useEffect(() => {
    if (props.defaultSuggestions && focused) {
      setShowSuggestions(true);
    }
  }, [focused, props.defaultSuggestions]);

  //** ComponentDidUpdate
  useEffect(() => {
    const textInput = ReactDOM.findDOMNode(inputElRef.current);

    // ** For searchbar focus
    if (textInput !== null && props.autoFocus) {
      inputElRef.current.focus();
    }

    // ** If user has passed default suggestions & focus then show default suggestions
    if (props.defaultSuggestions && focused) {
      setShowSuggestions(true);
    }

    // ** Function to run on user passed Clear Input
    if (props.clearInput) {
      props.clearInput(userInput, setUserInput);
    }

    // ** Function on Suggestions Shown
    if (props.onSuggestionsShown && showSuggestions) {
      props.onSuggestionsShown(userInput);
    }
  }, [setShowSuggestions, focused, userInput, showSuggestions, props]);

  // ** On External Click Close The Search & Call Passed Function
  useOnClickOutside(container, () => {
    setShowSuggestions(false);
    if (props.externalClick) {
      props.externalClick();
    }
  });

  let suggestionsListComponent;

  if (showSuggestions) {
    suggestionsListComponent = (
      <PerfectScrollbar
        className={classnames("suggestions-list", {
          [props.wrapperClass]: props.wrapperClass,
        })}
        ref={suggestionsListRef}
        component="ul"
        options={{ wheelPropagation: false }}
      >
        {renderSuggestions()}
      </PerfectScrollbar>
    );
  }

  return (
    <div className="autocomplete-container" ref={container}>
      <input
        type="text"
        onChange={(e) => {
          onChange(e);
          if (props.onChange) {
            props.onChange(e);
          }
        }}
        onKeyDown={(e) => onKeyDown(e)}
        value={userInput}
        className={`autocomplete-search ${
          props.className ? props.className : ""
        }`}
        placeholder={props.placeholder}
        onClick={onInputClick}
        ref={inputElRef}
        onFocus={() => setFocused(true)}
        autoFocus={props.autoFocus}
        onBlur={(e) => {
          if (props.onBlur) props.onBlur(e);
          setFocused(false);
        }}
      />
      {suggestionsListComponent}
    </div>
  );
};

export default Autocomplete;

// ** PropTypes
Autocomplete.propTypes = {
  grouped: PropTypes.bool,
  autoFocus: PropTypes.bool,
  onKeyDown: PropTypes.func,
  onChange: PropTypes.func,
  clearInput: PropTypes.func,
  placeholder: PropTypes.string,
  externalClick: PropTypes.func,
  defaultValue: PropTypes.string,
  wrapperClass: PropTypes.string,
  filterHeaderKey: PropTypes.string,
  suggestionLimit: PropTypes.number,
  onSuggestionsShown: PropTypes.func,
  onSuggestionItemClick: PropTypes.func,
  filterKey: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
};
