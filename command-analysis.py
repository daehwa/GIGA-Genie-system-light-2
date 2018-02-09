#! /usr/bin/python2.7
# -*- coding: utf-8 -*-

import konlpy
import nltk
import sys

# POS tag a sentence
sentence = sys.argv[1]
words = konlpy.tag.Twitter().pos(sentence)

# Define a chunk grammar, or chunking rules, then chunk
grammar = """
NP: {<N.*>*<Suffix>?}   # Noun phrase
VP: {<V.*>*}            # Verb phrase
AP: {<A.*>*}            # Adjective phrase
"""
parser = nltk.RegexpParser(grammar)
chunks = parser.parse(words)

for subtree in chunks.subtrees():
	if subtree.label() != 'S':
		print(subtree)

#print("# Print whole tree")
#print(chunks.pprint())

#print("\n# Print noun phrases only")
#for subtree in chunks.subtrees():
#    if subtree.label()=='NP':
#        print(' '.join((e[0] for e in list(subtree))))
#        print(subtree.pprint())

# Display the chunk tree
#chunks.draw()
