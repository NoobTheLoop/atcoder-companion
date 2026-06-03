
console.log(
    'BACKGROUND STARTED'
);

chrome.action.onClicked.addListener(

    async (tab)=>{

        console.log(
            'ICON CLICKED'
        );

        if(
            !tab.id
        ){

            return;
        }

        await chrome.scripting.executeScript({

            target:{

                tabId:
                    tab.id
            },

            files:[
                'content.js'
            ]
        });
    }
);
