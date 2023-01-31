The hardest part about restructuring a Typescript project is updating all the import paths. While many of our favourite editors can help us, there is a powerful option hiding away in the typescript compiler options that removes this issue entirely. 

## Import Paths

Imports are a key part of any Typescript project, enabling us to include code from different files. A typical Angular component will have imports like this.

```typescript
// Imports from node_modules
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
// Import from relative paths
import { UserComponent } from './user.component';
import { SharedAppCode } from '../../../common/sharedCode';
```
Importing from node_modules is always the same no matter where you are in your app. This is because by default any import not starting with a '.' or '/' is assumed to be found under node_modules.

For any shared code that lives in your app, depending where your current file is located, you may have '../common', '../../common', '../../../common' or even '../../../../common' :scream:

These inconsistent relative paths are ugly and make restructuring our code painful. Move a file that contains these paths and the imports will have to change accordingly. While this may seem like a small issue, it quickly gets out of hand in large apps. While code editors do their best to update the paths, sometimes they just stop working... :disappointed:

Fear not! Typescript enables us to avoid this issue altogether.

## tsconfig compilerOptions : { paths : { ... } }

There is a *compilerOption* option call *paths* which enables us to setup path mappings that we can use in our imports.

Given the following file structure we will setup two path mappings. One to enable us to import our sharedCode in each module without relative paths and the second to import our environments file.

```
src/
├── app/
│   ├── common/
|   |   └── sharedCode.ts
│   ├── feature/
|   |   └── user/
|   |       └── user.module.ts
│   ├── feature2/
|   |   └── account.module.ts      
├── environments/
|   └── environments.ts
tsconfig.json
```

In our tsconfig.json file we first need to set a *baseUrl* to tell the compiler where the paths are starting from. In our case this is the *src* folder. 

```json
"compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "~app/*": ["app/*"],
      "~environments": ["environments/environment"],
    }
  }
```
Let's take a look at the first path mapping for app.
```json
  "~app/*": ["app/*"]
```
 This is telling the Typescript compiler that whenever it sees an import starting with *~app/* that it should look for the code under the *src/app/* folder. This enables us to update the import paths to both be *'~app/common/sharedCode'*. The trailing /* means we can include any folder path after that point. In our case this is the *common/sharedCode*.

```typescript
// BEFORE: user.module.ts
import {...} from '../../common/sharedCode';
// BEFORE: account.module.ts
import {...} from '../common/sharedCode';

// AFTER: user.module.ts, account.module.ts
import {...} from '~app/common/sharedCode';
```
So despite having different relative paths, both modules now share exactly the same import path. You can hopefully see why this makes restructuring a lot easier. Now if we change the folder structure our imports no longer have to change. :sparkles:

You can also have explicit path mappings. Here we are directly pointing at the environments file. Notice this time there is no * wildcard. Using this we can shorten the import path to this file. 
```json
  "~environments": ["environments/environment"]
```

```typescript
// BEFORE: user.module.ts
import {...} from '../../../environments/environment';
// BEFORE: account.module.ts
import {...} from '../../environments/environment';

// AFTER: user.module.ts, account.module.ts
import {...} from '~environments';
```

## Sensible Import Grouping

You may have noticed that I started both of my path mappings with a ~. The reason I have done this is so that I get a sensible grouping when I use Visual Studio Code to organise my imports. Without the ~ then your *app/common* imports would be grouped with your external imports.


```typescript
// EXTERNAL: From node_modules
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

// LOCAL: Path mapped 
import { SharedAppCode } from '~app/common/sharedCode';
// LOCAL: Relative path
import { UserComponent } from './user.component';
```

I really love using path mappings to clean up my import paths. They also mean that should I need to restructure my code, it will be a breeze. You can even do a simple find and replace now to update import paths should you wish to now. 


---

Follow me on Twitter [@ScooperDev](https://twitter.com/SCooperDev) or [Tweet](https://twitter.com/intent/tweet?text=%22Restructure%20with%20ease%20thanks%20to%20Typescript%20path%20mappings%22%20by%20%40SCooperDev%20%23DEVCommunity%20https%3A%2F%2Fdev.to%2Fscooperdev%2Frestructure-with-ease-thanks-to-typescript-path-mappings-4b0e) about this post.