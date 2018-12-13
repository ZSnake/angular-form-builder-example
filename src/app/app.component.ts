import { Component } from '@angular/core';


interface OnInit {
  ngOnInit(): void;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Form Builder';
  formTitle = '';
  formModel = {};
  showcaseModel = '';
  showcaseFormConfig = '';
  preSchema: any = {
    appName: 'BE',
    roleName: 'be-user',
    roleType: 'role',
    groups: [ ],
    attributes: [{
      name: 'orgid',
      group: '',
      displayLabel: 'Org Identifier',
      description: 'Org Identifier',
      uiType: 'SELECT', // input type
      dynamicattr: 'orgid',
      type: '',
      required: '1',
      size: '100',
      maxLength: '',
      helpText: 'Select Org Identifier',
      columnOrder: '1',
      rowOrder: '1',
      validationMsg: 'Select valid Org Identifier',
      attrData: [
        {
          key: 'orgid1',
          value: 'Org Identifier 1'
        },
        {
          key: 'orgid2',
          value: 'Org Identifier 2'
        },
        {
          key: 'orgid3',
          value: 'Org Identifier 3'
        },
        {
          key: 'orgid4',
          value: 'Org Identifier 4'
        }
      ]
    },
      {
        name: 'BID',
        group: '',
        displayLabel: 'BID(s)',
        description: 'Bundles Identification',
        uiType: 'TEXTBOX',
        dynamicattr: 'bid',
        type: '',
        required: '1',
        size: '100',
        maxLength: '300',
        helpText: 'Enter BID(s)',
        columnOrder: '1',
        rowOrder: '1',
        regexPattern: 'abcd',
        validationMsg: 'Enter information in valid fomat',
        attrData: []
      },
      {
        name: 'age',
        group: '',
        displayLabel: 'Age',
        description: 'Bundles Identification',
        uiType: 'NUMBER',
        dynamicattr: 'bid',
        type: '',
        attrData: []
      },
      {
        name: 'phone',
        group: '',
        displayLabel: 'Phone number',
        description: 'Bundles Identification',
        required: '1',
        regexPattern: 'abc',
        uiType: 'TEXTBOX',
        attrData: []
      },
      {
        name: 'sex',
        group: '',
        displayLabel: 'Sex',
        description: 'Bundles Identification',
        uiType: 'RADIOBUTTONS',
        dynamicattr: 'bid',
        type: '',
        attrData: [
          {
            key: 'm',
            value: 'Male'
          },
          {
            key: 'f',
            value: 'Female'
          },
        ]
      },
      ]
  };
  formConfig: any = {
    schema: {
      type: 'object',
      properties: {},
      required: [],
    },
    form: [],
  };

  onChange() {
    this.showcaseModel = JSON.stringify(this.formModel, null, 4);
  }

  /* This function is the form builder, it goes through the attributes and constructs
  a json object that will serve as configuration for the `json-schema-form` directive */
  createSchema() {
    // Taking the form title so it can be used somewhere
    this.formTitle = this.preSchema.appName;

    // iterating over the attributes array from which the fields are constructed
    this.preSchema.attributes.forEach((attribute) => {
      const inputController: any = {};
      // We create a new empty object in which we'll place information as we need.
      // We add a new entry to our schema with the attribute name as key and we get the type from
      // the getFormControllerType function, which is basically a switch decision with the different options
      this.formConfig.schema.properties[attribute.name] = {
        title: attribute.displayLabel,
        type: this.getSchemaDefinitionInputType(attribute.uiType),
      };
      /* Every time an attribute has required set to 1, it'll be added to a "required" variable list
        If the required element is not filled, the user can't submit the form
      */

      /* If the attribute is required we add it to a required list withing our form schema
      Whenever an input that's required is not filled, the form' wont let the user submit */
      if (attribute.required === '1') {
        this.formConfig.schema.required.push(attribute.name);
      }

      /* If the regexPattern exist within the attribute, we add a pattern to the  input. Whenever
      an input with a pattern doesn't match the pattern the  form won't let the user submit */
      if (attribute.regexPattern) {
        this.formConfig.schema.properties[attribute.name].pattern = attribute.regexPattern;
        this.formConfig.schema.properties[attribute.name].validationMessage = attribute.validationMsg || 'Error';
      }
      /* If the input is a select, radiobutton or checkbox we'll also need to add a
      "form" controller to our json. Form controllers are meant to configure more complicated
      field types  and groups */
      if (attribute.uiType === 'SELECT' || attribute.uiType === 'RADIOBUTTONS') {
        /* We start building our input controller by setting up the key and title.
        The key *must* correspond to what the input is named in our schema properties. In
        our case  that's the attribute name */
        inputController.key = attribute.name;
        // The title is what the label will contain, for this we use the attribute's displayName
        inputController.title = attribute.displayLabel;
        /*
          We then set an empty title map. This is a map that contains the key/value pairs in
          group inputs like selects and radiobuttons. For example, consider the following Select:
          <select>
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes Benz</option>
            <option value="audi">Audi Motors</option>
          </select>
          The titleMap for that would look something like:
          {
            "volvo": "Volvo",
            "saab": "Saab",
            "mercedes": "Mercedes Benz",
            "audi": "Audi Motors",
          }
          this will tell the directive what value each option has and what label to display
          in the select input.
        */
        inputController.titleMap = {};
        /* For each element in attrData we'll add a new key/value pair to our titleMap resulting
        in a map object like the one described above */
        attribute.attrData.forEach(({key, value}) => {
          inputController.titleMap[key] = value;
        });
        /* Now we have the input controller we also need to add an "enum" attribute
        to our schema's definition for that field, which will have a list of values for the select */
        this.formConfig.schema.properties[attribute.name].enum = attribute.attrData.map(({key}) => key);
        // Finally we set the type for our  inputController by calling getFormControllerType
        inputController.type = this.getFormControllerType(attribute.uiType);
        this.formConfig.form.push(inputController);
      } else {
        this.formConfig.form.push(attribute.name);
      }
    });
    this.showcaseFormConfig = JSON.stringify(this.formConfig,  null, 4);
  }

  getFormControllerType(uiType) {
    switch (uiType) {
      case 'SELECT':
        return 'select';
      case 'NUMBER':
        return 'number';
      case 'RADIOBUTTONS':
        return 'radiobuttons';
      case 'TEXTBOX':
      default:
        return 'string';
    }
  }

  getSchemaDefinitionInputType(uiType) {
    switch (uiType) {
      case 'NUMBER':
        return 'number';
      case 'SELECT':
      case 'TEXTBOX':
      case 'RADIOBUTTONS':
      default:
          return 'string';
    }
  }

  ngOnInit() {
    this.createSchema();
  }
}
