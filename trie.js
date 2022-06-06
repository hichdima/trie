"use strict";
const TrieNode = require('./trieNode.js');

class Trie {
  constructor() {
    this.root = new TrieNode(''); //Root node
  }
  //Function to get the index of character 't'
  getIndex(t) {
    return t.charCodeAt(0) - "a".charCodeAt(0); //The charCodeAt() function returns the order of a given character
  }

  //Function to insert a key,value pair in the Trie
  insert(key) {
    //None keys are not allowed
    if (key == null) {
      return;
    }

    key = key.toLowerCase();  //Keys are stored in lowercase
    let currentNode = this.root;
    let index = 0;          //To store the character index

    //Iterate the trie with the given character index,
    //If the index points to null
    //simply create a TrieNode and go down a level
    for (var level = 0; level < key.length; level++) {
      index = this.getIndex(key[level]);

      if (currentNode.children[index] == null) {
        currentNode.children[index] = new TrieNode(key[level]);
      }
      currentNode = currentNode.children[index];
    }

    //Mark the end character as leaf node
    currentNode.markAsLeaf();
  }
  //Function to search for a given key in the Trie
  search(key) {
    if (key == null) {
      return false; //null key
    }

    key = key.toLowerCase();
    let currentNode = this.root;
    let index = 0;

    //Iterate the Trie with given character index,
    //If it is null at any point then we stop and return false
    //We will return true only if we reach leafNode and have traversed the
    //Trie based on the length of the key

    for (var level = 0; level < key.length; level++) {
      index = this.getIndex(key[level]);
      if (currentNode.children[index] == null) {
        return false;
      }
      currentNode = currentNode.children[index];
    }
    if (currentNode != null && currentNode.isEndWord) {
      return true;
    }
    return false;
  }

  //Helper Function to return true if currentNode does not have any children
  hasNoChildren(currentNode) {
    for (var i = 0; i < currentNode.children.length; i++) {
      if (currentNode.children[i] != null)
        return false;
    }
    return true;
  }

  //Recursive function to delete given key
  deleteHelper(key, currentNode, length, level) {
    let deletedSelf = false;

    if (currentNode == null) {
      console.log("Key does not exist");
      return deletedSelf;
    }

    //Base Case: If we have reached at the node which points to the alphabet at the end of the key.
    if (level == length) {
      //If there are no nodes ahead of this node in this path
      //Then we can delete this node
      if (this.hasNoChildren(currentNode)) {
        currentNode = null;
        deletedSelf = true;
      }

      //If there are nodes ahead of currentNode in this path 
      //Then we cannot delete currentNode. We simply unmark this as leaf
      else {
        currentNode.unMarkAsLeaf();
        deletedSelf = false;
      }
    }
    else {
      let childNode = currentNode.children[this.getIndex(key[level])];
      let childDeleted = this.deleteHelper(key, childNode, length, level + 1);
      if (childDeleted) {
        //Making children pointer also None: since child is deleted
        currentNode.children[this.getIndex(key[level])] = null;
        //If currentNode is leaf node that means currentNode is part of another key
        //and hence we can not delete this node and it's parent path nodes
        if (currentNode.isEndWord)
          deletedSelf = false;

        //If childNode is deleted but if currentNode has more children then currentNode must be part of another key
        //So, we cannot delete currenNode
        else if (this.hasNoChildren(currentNode) == false)
          deletedSelf = false;

        //Else we can delete currentNode
        else {
          currentNode = null;
          deletedSelf = true;
        }
      }
      else
        deletedSelf = false;
    }
    return deletedSelf
  }

  //Function to delete given key from Trie
  delete(key) {
    if (this.root == null || key == null) {
      console.log("None key or empty trie error");
      return;
    }

    this.deleteHelper(key, this.root, key.length, 0);
  }

  totalWords(rootN) {
    let result = 0;

    // Leaf denotes end of a word
    if (rootN.isEndWord) {
      result += 1;
    }

    for (var i = 0; i < 26; i++) {
      if (rootN.children[i] != null) {
        result += this.totalWords(rootN.children[i]);
      }
    }

    console.log(result)
    return result;
  }

  //Recursive Function to generate all words
  getWords(root, result, level, string) {

    //Leaf denotes end of a word
    if (root.isEndWord) {
      //current word is stored till the 'level' in the character array
      let temp = "";
      for (var x = 0; x < level; x++) {
        temp += String(string[x]);
      }
      result.push(temp);
    }
    for (var i = 0; i < 26; i++) {
      if (root.children[i] != null) {
        //Non-None child, so add that index to the character array
        string[level] = String.fromCharCode(i + "a".charCodeAt(0));
        this.getWords(root.children[i], result, level + 1, string);
      }
    }
  }

  findWords(root) {
    let result = [];
    let chararr = [];
    for (var i = 0; i < 20; i++) {
      chararr.push(null);
    }
    this.getWords(root, result, 0, chararr);
    return result;
  }
  
  isFormationPossible(dict,word){
    // Build trie with words from dict
    for (var i=0; i<dict.length; i++){
      t.insert(dict[i])
    }
    
    let currentNode = t.root;
    for (var i=0; i<word.length; i++){
      let char = t.getIndex(word[i]);
      if (currentNode.children[char] == null){
        return false;
      }
      //"Dima".substring(2) = "ma"
      else if (currentNode.children[char].isEndWord == true && t.search(word.substring(i+1))){
        return true
      }
      currentNode = currentNode.children[char]
    }
  }
}

// Input keys (use only 'a' through 'z' and lower case)
let keys = ["the", "hello", "there", "answer", "any",
  "by", "world", "their", "abc"];

//Construct Trie
let t = new Trie();
for (var i = 0; i < keys.length; i++) {
  t.insert(keys[i]);
}

var str = "dima";
var substr = str.substring(2);
console.log(substr);

console.log(t.findWords(t.root));

