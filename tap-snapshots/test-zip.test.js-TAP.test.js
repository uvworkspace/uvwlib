/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/zip.test.js TAP can zip and get YAML > undefined 1`] = `
- folder: bar
  files:
    - folder: cat
      files:
        - file: file3.txt
          text: |2+
            FILE 3
            line 4
            line 5
    - file: file1.txt
      text: |2+
        FILE 1
        line 2
    - file: file2.txt
      text: |2+
        FILE 2
        line 3
- file: foo.txt
  text: |2+
    FOO TEXT
    line 1
`
