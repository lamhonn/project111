### Folder structure of *src*

#### components

This folder consists of individual .tsx components.
There is a one folder for common components, "common", which consists of commonly used components between .tsx files, as the name suggests.

**Notes:**

- __Usage of Material UI components is highly preferred. Using of "pure" React/HTML is discouraged unless no viable Material UI solution is absolutely not to be found. See Material UI documentation for well-structured examples.__

#### context

This folder is used to accommodate React Context related components and utils.

#### i18n

This folder accommodates everything related to translation library i18n, including future translations.
It would be preferred to start using i18n right away so we can avoid future overhead of replacing all the hard-coded strings into i18n.

#### screens

This folder is used for container components. Such component is used to combine individual components from "components" files into coherent views to be further used in main components.

#### utils

THis folder accommodates any scripts and helper functions needed to do calculations, time conversions etc.