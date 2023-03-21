# Errors vs Exceptions #

## Exception ##

An *Exception* indicates an "exceptional condition" that a reasonable application might want to catch. There are two types of exceptions: `checked` and `unchecked`.

### Checked Exception ###

A *Checked Exception* is generally one from which a program can recover, and it might be a good idea to recover from such an exception programmatically. Examples include `FileNotFoundException`, `ParseException`, etc.  A programmer is expected to _check_ for these exceptions by using try-catch blocks, or throw it back to the caller.

Examples:
    - FileNotFoundException
    - ParseException

### Unchecked Exception ###

An *Unchecked Exception* is one which might not happen if everything is in order, but occurred anyway. Examples include `IndexOutOfBoundsException`, `InvalidCastException`, etc. It is unneccessary for the end programmer to check for such exceptions.

Examples:
    - IndexOutOfBoundsException
    - InvalidCastException

## Error ##

An *Error* indicates a serious problem that a reasonable application should not try to catch. Something severe enough has gone wrong the most applications should crash rather than try to handle the problem. Most such errors are abnormal conditions.

An error is also unchecked, and the programmer is not require to do anything with these. In fact it is a bad idea to use a `try-catch` clause for errors. Most often, recovery from an error is not possible, and the program should be allowed to terminate.

Examples:
    - MalformedContentError
    - AssertionError
    - OutOfMemoryError
    - StackOverflowError
