# MITRE Interoperability Playbook
The purpose of the MITRE Interoperability Playbook is to create a web application that
captures the learnings of the MITRE FHIR teams as they developed mCODE and other 
FHIR-based efforts – what worked well and what did not – and to provide a recipe to 
successfully launch and implement new healthcare interoperability initiatives.

You can see it up and running at [https://codex-hl7-fhir-accelerator.github.io/playbook/](https://codex-hl7-fhir-accelerator.github.io/playbook/)

## Installation
These installation instructions may seem verbose as they were written to be 
accessible to most anyone. It should go quickly if you already have the 
necessary tools installed and follow the jumps provided!

### MacOS
It is most likely the case that these steps are incredibly similar for all 
other unix based operating systems

1. Open __Terminal__

2. Check if you have __Git__ installed by inputting:
    
     ```
     git --version
     ```

    * If __Git__ is already installed, __Terminal__ should output something 
    like:
    
        ```
        git version 2.37.1
        ```
         
        Jump to [step 6](#step-6) if this is the case.
    
    * If __Terminal__ responded with anything that might indicate it did not 
    recognize __Git__, such as:
    
         ```
         -bash: git: command not found
         ``` 
         
        continue to [step 3](#step-3).

3. <a name="step-3"></a>Check if you have __Homebrew__ installed by 
inputting:

    ```
    brew -v
    ```

    * If __Homebrew__ is already installed, __Terminal__ should output 
    something like:

        ```
        Homebrew 4.2.19
        ```

        Jump to [step 5](#step-5) if this is the case.

    * If __Terminal__ responded with anything that might indicate it did not 
    recognize __Homebrew__, such as:

        ```
        -bash: brew: command not found
        ```

        continue to [step 4](#step-4).

4. <a name="step-4"></a>Install __Homebrew__ by inputting:

    ```
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```

5. <a name="step-5"></a>Install __Git__ by inputting:

    ```
    brew install git
    ```

6. <a name="step-6"></a>Configure __Git__ to match your __Github__ account:

    ```
    git config --global user.name "YOUR NAME"
    git config --global user.email "YOUR@EMAIL.com"
    ```

    (Don't have a __Github__ account? Register [here](https://github.com/join) 
    then run the above commands)

7. <a name="step-7"></a>Create a new directory to store this web app. Feel 
free to put this directory wherever makes sense. For the sake of simplicity, 
the following commands will create it directly in the home directory:

    ```
    cd ~
    ```

8. Clone the DEL Demo repository into your new directory by inputting:

    ```
    git clone https://github.com/CodeX-HL7-FHIR-Accelerator/playbook.git
    ```

9. <a name="step-10"></a>Check if you have __Ruby__ installed by inputting:

    ```
    ruby -v 
    ```

    * If __Ruby__ is already installed, __Terminal__ should output something 
    like:
    
        ```
        ruby 3.2.2
        ```
         
        Jump to [step 13](#step-13) if this is the case.
    
    * If __Terminal__ responded with anything that might indicate it did not 
    recognize __Ruby__, such as:
    
         ```
         -bash: ruby: command not found
         ``` 
         
        continue to [step 10](#step-10).

10. <a name="step-11"></a>Check if you have the **R**uby **V**ersion 
**M**anager (__RVM__) by inputting: 

    ```
    rvm -v
    ```

    * If __RVM__ is already installed, __Terminal__ should output something 
    like:
    
        ```
        rvm 1.29.12 (latest) by Michal Papis, Piotr Kuczynski, Wayne E. Seguin [https://rvm.io]
        ```
         
        Jump to [step 12](#step-12) if this is the case.
    
    * If __Terminal__ responded with anything that might indicate it did not 
    recognize __RVM__, such as:
    
         ```
         -bash: rvm: command not found
         ``` 
         
        continue to [step 11](#step-11)

11. <a name="step-12"></a>Install __RVM__ by inputting:

    ```
    \curl -L https://get.rvm.io | bash -s stable
    ```

    If it asks for your password, provide it. Once downloading __RVM__, 
    you will need to close and reopen __Terminal__. Input:

    ```
    exit
    ```
    Then close __Terminal__, and open __Terminal__ again.

12. <a name="step-13"></a>Install __Ruby__ by inputting:

    ```
    rvm install ruby-3.2.2
    ```

13. <a name="step-14"></a>Install __Rails__. 

    First, input the following to ensure that **Ruby**'s package 
    manager __RubyGems__ is up to date:

    ```
    gem update --system
    ```

14. <a name="step-15"></a>Set up your local instance of the app. 
    
    First, make sure you're in the correct directory (Remember to change 
    the cd path if you chose to set up the app in a different location):

    ```
    cd ~/playbook
    ```

    Create a gemset for the project:
    ```
    rvm gemset create playbook
    ```

    Switch to the __RVM__ gemset you just created:
    ```
    rvm @playbook
    ```

    Next, ensure you have the __Bundler__ gem installed by inputting:

    ```
    gem install bundler
    ```

    Finally, use __Bundler__ to install the DEL Demo's gems:

    ```
    bundle install
    ```

## Run Application
Once installation is complete, you can run the app by following these steps:

1. Open __Terminal__

2. Make sure your working directory is where the app is stored. If you 
followed the MacOS installation directions above with no variation, 
inputting the following will get you there:

    ```
    cd ~/playbook
    ```

    If that is not where your playbook directory is, instead input 
    `cd <path>` where `<path>` is the path to your playbook directory.

3. Build the web site using __middleman__.  You will also need to run this command every time you update the files in the __source__ directory.

    ```
    middleman build
    ```

4. Start the __middleman__ server.

    ```
    middleman server
    ```
    
5. The playbook web site should be running! Open a browser (I suggest __Chrome__) 
and type the following into the address bar:

    ```
    localhost:4567
    ```

6. When you're done using the app, you need to make sure the server stops 
running. To do this gracefully, you need to do two things:
    
    * First, go back to your __Terminal__ window and stop the web site by
    using the hotkey:

        ```
        control-C
        ```

## Copyright

Copyright 2024 The MITRE Corporation. All rights reserved.
