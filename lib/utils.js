"use strict";

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

/**************************************************************************
 * FUNCTIONS
 ***************************************************************************/

/**
 * Executes multiple regular expressions until one succeeds
 * @public
 * @param  {object}  regexes
 * @param  {string}  str
 * @param  {string}  [mode]
 * @param  {boolean} [highestPosition]
 * @return {object}  The result of the first successfull regular expression
 */
var loopRegexes = function (
  regexes,
  str,
  mode = Symbol.match,
  highestPosition = true
) {
  var _match;
  var _minLength = mode === Symbol.split ? 1 : 0;
  var _maxLength = str.length;

  for (var _i = 0; _i < regexes.length; _i++) {
    var _regex = regexes[_i];

    if (typeof regexes[_i] === "string") {
      // Build the regex
      _regex = new RegExp(regexes[_i]);
    }

    var _currentMatch = _regex[mode](
      str || "",
      mode === Symbol.replace ? "" : undefined
    );

    if (mode === Symbol.replace) {
      _match = _currentMatch;

      // A successfull replace must return a smaller string than the input
      if (_match.length < _maxLength) {
        break;
      }
    } else if (mode === Symbol.split || mode === Symbol.match) {
      // A successfull split must return an array with at least two items
      if ((_currentMatch || []).length > _minLength) {
        if (highestPosition === true) {
          // No previous match?
          if (!_match) {
            // Save match and continue looking for other matches
            _match = _currentMatch;
          } else {
            var _higher;

            if (mode === Symbol.match) {
              _higher = _match.index > _currentMatch.index;
            } else if (mode === Symbol.split) {
              _higher = _match[0].length > _currentMatch[0].length;
            }

            // Match positioned higher than previous one?
            if (_higher) {
              // Replace match and continue looking for other matches
              _match = _currentMatch;
            }
          }
        } else {
          // Save match and stop
          _match = _currentMatch;

          break;
        }
      }
    }
  }

  return mode === Symbol.replace ? _match || "" : _match || [];
};

/**
 * Reconciliates match substrings after a "split" operation
 * @public
 * @param  {object}   match
 * @param  {number}   min_substrings
 * @param  {object}   default_substrings
 * @param  {function} fn_exlude
 * @return {string}   The reconciliated string
 */
var reconciliateSplitMatch = function (
  match,
  min_substrings,
  default_substrings,
  fn_exlude = null
) {
  var _str = "";

  // Add default substrings
  for (var _i = 0; _i < default_substrings.length; _i++) {
    _str += match[default_substrings[_i]];
  }

  // More substrings than expected?
  if (match.length > min_substrings) {
    // Reconciliate them
    for (var _i = min_substrings; _i < match.length; _i++) {
      var _exclude = false;

      // Exclude the substring?
      if (typeof fn_exlude === "function") {
        _exclude = fn_exlude(_i);
      }

      if (_exclude === false) {
        _str += match[_i];
      }
    }
  }

  return _str;
};

/**
 * Trims a string
 * @public
 * @param  {string} str
 * @return {string} The trimed string
 */
var trimString = function (str) {
  return (str || "").trim() || "";
};

/**************************************************************************
 * EXPORTS
 ***************************************************************************/

exports.loopRegexes = loopRegexes;
exports.reconciliateSplitMatch = reconciliateSplitMatch;
exports.trimString = trimString;

exports.default = {
  loopRegexes: loopRegexes,
  reconciliateSplitMatch: reconciliateSplitMatch,
  trimString: trimString,
};
