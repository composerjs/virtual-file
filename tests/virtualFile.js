import test from 'ava';

test.todo('if path is not a URL VirtualFile should have `path.parse` fields and `file.isURL` should be false');
test.todo('if path is a URL file `file.isURL` should be true');
test.todo('utf8 and utf16 multi-byte characters should be maintained when the Buffer stringified');
test.todo('extend() should assign fields from the file parameter to the VirtualFile instance');
test.todo('clone() should return a copied instance of the VirtualFile with new memory allocations');
