/**
 * @file srt2webvtt.js
 */

/**
 * @license
 * Copyright (c) 2014 Silvia Pfeiffer <silviapfeiffer1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @see {@link https://github.com/silviapfeiffer/silviapfeiffer.github.io}
 */

/**
 * convert an SRT cue to WebVTT format
 *
 * @param {String} caption SRT file caption
 * @return {String} caption converted to WebVTT format
 */
const convertSrtCue = function (caption) {
  // remove all html tags for security reasons
  // srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');

  var cue = '';
  var s = caption.split(/\n/);
  var line = 0;

  // detect identifier
  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
    cue += s[0].match(/\w/) + '\n';
    line += 1;
  }

  // get time strings
  if (s[line].match(/\d+:\d+:\d+/)) {
    // convert time string
    var m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
    if (m) {
      cue += m[1] + ':' + m[2] + ':' + m[3] + '.' + m[4] + ' --> ' +
      m[5] + ':' + m[6] + ':' + m[7] + '.' + m[8] + '\n';
      line += 1;
    } else {
      // Unrecognized timestring
      return '';
    }
  } else {
    // file format error or comment lines
    return '';
  }

  // get cue text
  if (s[line]) {
    cue += s[line] + '\n\n';
  }

  return cue;
};

/**
 * convert an SRT file's content to WebVTT format
 *
 * @param {String} data SRT file contents
 * @return {String} data converted to WebVTT format
 */
const srt2webvtt = function (data) {
  if (typeof data !== 'string') {
    return null;
  }

  // remove dos newlines
  var srt = data.replace(/\r+/g, '');
  // trim white space start and end
  srt = srt.replace(/^\s+|\s+$/g, '');

  // get cues
  var cuelist = srt.split('\n\n');
  var result = '';

  if (cuelist.length > 0) {
    result += 'WEBVTT\n\n';
    for (var i = 0; i < cuelist.length; i = i + 1) {
      result += convertSrtCue(cuelist[i]);
    }
  }

  return result;
};

const isSrt = function (data) {
  return data.match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
};

export default {srt2webvtt, isSrt};
