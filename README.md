# Pots Pal

### **[trello](https://trello.com/b/b7WofYMN/pots-pal)**

![prototype](https://i.imgur.com/9S5vwqi.png)

* when user logs in, they are able to input information immediately. if they want to log more detailed info, they go in to daily log. 
* there, they can add information on parts of their day that may affect their symptoms. they can also edit information that has already been put in. 
    * stretch goal: allow people to add meals to favorites so they don't have to re-type meals? 
        * unsure of the logic behind adding things seperated by commas to update in the db....
        * what if they spell a dish differently 
* back to home page, if they can click on the calendar 
* in calendar page, they can see specific days information, and at the bottom, view commonalities in good, bad, or neutral days. 
* they can also update their log for a previous day. 
* each calender day states good, bad, or neutral days with a different colored dot.

## ERD

![erd](https://i.imgur.com/Up58yV1.png)

## Component Hierarchy 

![component hierarchy](https://i.imgur.com/l6sMfjH.png)

## Sources 
* [generics](https://testdriven.io/blog/drf-views-part-2/)

* [empty fields](https://medium.com/@maruthurnavin/handling-empty-and-optional-fields-in-django-b7ef7979e83e#:~:text=Model%20Forms%3A%20When%20creating%20forms,in%20forms%20using%20blank%3DTrue.)

* [dev pals for login](https://github.com/kingwilldabeast/dev-pals)

* chatgpt
    * helped learn django error coding formats
    * helped with formatting calendar page logic

* [learning about backend data rendering costs](https://community.weweb.io/t/fetching-data-and-filtering-best-practices/1001/12)

* [troubleshooting date-fns](https://stackoverflow.com/questions/63161711/react-native-and-date-fns-problem-with-inserting-current-date)

* [location path name](https://www.w3schools.com/jsref/prop_loc_pathname.asp)

* [django filtering using 2 models](https://stackoverflow.com/questions/75392654/django-filter-using-q-objects-on-two-models)

* [more on django Q](https://stackoverflow.com/questions/34115148/django-filtering-from-models-model-objects-filterq)

* [viewset vs apiview](https://medium.com/@mathur.danduprolu/apiview-vsviewset-in-django-rest-framework-aa9a77921d53)
    * "Standard CRUD Operations: If your API follows standard CRUD operations and you want to minimize boilerplate code, ViewSet is a more efficient choice. It leverages DRF's built-in functionality to handle common actions, making your codebase more maintainable."

* [meta options](https://docs.djangoproject.com/en/5.0/ref/models/options/)

* [django counter](https://stackoverflow.com/questions/3606416/django-most-efficient-way-to-count-same-field-values-in-a-query)

*[getting info for day of and day before](https://www.geeksforgeeks.org/python-datetime-timedelta-function/)