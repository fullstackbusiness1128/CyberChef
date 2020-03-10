/**
 * Magic tests.
 *
 * @author n1474335 [n1474335@gmail.com]
 *
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";


TestRegister.addTests([
    {
        name: "Magic: nothing",
        input: "",
        expectedOutput: "Nothing of interest could be detected about the input data.\nHave you tried modifying the operation arguments?",
        recipeConfig: [
            {
                op: "Magic",
                args: [3, false, false]
            }
        ],
    },
    {
        name: "Magic: hex",
        input: "41 42 43 44 45",
        expectedMatch: /"#recipe=From_Hex\('Space'\)"/,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, false, false]
            }
        ],
    },
    {
        name: "Magic: jpeg",
        input: "\xff\xd8\xff\xe0\x00\x10\x4a\x46\x49\x46\x00\x01\x01\x01\x00\x48\x00\x48\x00\x00\xff\xdb\x00\x43\x00\x03\x02\x02\x03\x02\x02\x03\x03\x03\x03\x04\x03\x03\x04\x05\x08\x05\x05\x04\x04\x05\x0a\x07\x07\x06\x08\x0c\x0a\x0c\x0c\x0b\x0a\x0b\x0b\x0d\x0e\x12\x10\x0d\x0e\x11\x0e\x0b\x0b\x10\x16\x10\x11\x13\x14\x15\x15\x15\x0c\x0f\x17\x18\x16\x14\x18\x12\x14\x15\x14\xff\xdb\x00\x43\x01\x03\x04\x04\x05\x04\x05\x09\x05\x05\x09\x14\x0d\x0b\x0d\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\x14\xff\xc2\x00\x11\x08\x00\x32\x00\x32\x03\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x1c\x00\x00\x02\x02\x03\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x06\x07\x04\x05\x00\x02\x03\x01\x08\xff\xc4\x00\x1a\x01\x00\x03\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x05\x06\x03\x02\x01\x07\xff\xda\x00\x0c\x03\x01\x00\x02\x10\x03\x10\x00\x00\x01\xe7\x14\xd4\x6e\x92\x6e\xe0\x67\xd3\x01\x2e\xe2\x61\x94\xcc\xb8\xa2\x6a\x9e\xa0\x8a\x71\xfa\xde\xdc\x52\xd3\xd5\x89\x16\xe1\xbd\x57\x6b\x4c\xc9\xc9\x02\xad\xcd\x3f\x3d\xe3\x0e\xfc\xcd\x61\x95\xe9\x08\xa8\x74\x05\x4e\xc3\x14\x07\x5d\x62\xc5\x22\x57\xb8\x0f\xbd\x49\xd9\x50\xd2\x6b\x46\x3c\xe3\x8f\xa1\xd5\x83\x2d\x27\xa5\xbd\xf3\x24\x99\x82\x11\xf5\xd5\xf3\xf0\x05\x8f\x34\xbc\x16\xa5\x83\x00\x74\xaa\x86\x66\xb4\x8e\xf2\x89\x13\x88\xd9\xe2\x16\x56\xe5\xb3\x4a\x8c\xc9\xc9\x61\xa1\x95\xa5\x1d\x7e\xb8\xa8\x67\x65\xf3\xbd\xa4\xa7\xff\xc4\x00\x21\x10\x00\x02\x03\x00\x02\x02\x02\x03\x00\x00\x00\x00\x00\x00\x00\x00\x03\x04\x01\x02\x05\x00\x06\x11\x12\x13\x14\x16\x21\x24\xff\xda\x00\x08\x01\x01\x00\x01\x05\x02\xd9\xa5\x49\x5a\x1d\x6a\x39\xf8\xfa\xd5\x03\x98\xe6\x61\x44\x16\xa2\xc9\x82\xb4\xbc\x97\xae\x9e\xe4\x63\xec\x33\xd6\x24\x4b\x29\xa4\x98\xad\x5c\x4a\x68\xae\x4e\x5e\x41\x3c\x3f\xc8\x20\x0c\x4b\xc8\xd4\x42\x34\xb8\x7c\x2f\x3a\xd1\xea\x3a\x36\x19\xf4\x4d\x42\xd9\x41\xe9\x02\xc5\x8d\xbc\xd1\x45\xeb\xf5\x12\xcc\xb3\x9b\xc0\x8b\x17\x23\x99\x8e\xad\x9a\x67\xb7\x46\x65\x35\xd6\xa5\x9c\x81\xf8\x8b\x5e\x9f\x2e\x83\x4c\x35\xcd\xb3\x83\x45\x1c\xe1\xd9\x85\x35\xf3\x1c\xd2\x73\xad\x3a\x1a\xbd\x67\x87\xed\x89\x96\x96\x79\xb6\x11\x45\x9c\x9e\xb3\x03\x9d\x0c\x77\x06\xf2\xb8\x9b\x9f\x0b\x5a\x42\xaa\x4b\x58\xa4\xf6\x14\x45\xf4\x3b\x1d\x2a\x4c\x6c\xe5\x82\xba\x7d\x8f\xf9\x91\xcf\xa5\x46\xa6\xbf\xeb\x12\x0d\x7f\x1f\xff\xc4\x00\x2f\x11\x00\x01\x04\x01\x02\x03\x06\x04\x07\x00\x00\x00\x00\x00\x00\x00\x01\x00\x02\x03\x04\x11\x12\x31\x05\x13\x21\x14\x22\x41\x51\xa1\xf0\x32\x42\x71\x81\x23\x24\x52\x53\x61\x91\xf1\xff\xda\x00\x08\x01\x03\x01\x01\x3f\x01\xbf\x0e\x98\xc3\xc0\xfb\xa1\x19\x71\xca\xa8\x5b\x5d\xed\x73\xd3\x38\xe3\x98\xf7\x35\xad\x1a\x73\xfc\xa7\xcf\xda\x7b\xce\xf1\x4d\xb0\x21\x69\x0d\x0b\x4b\xcf\xce\x54\x5f\x98\xac\x1b\x28\xdf\x1f\xd6\x56\x98\x23\x9a\x37\x39\xbd\x4e\xde\xfd\x17\x16\xae\xd7\x5a\xdf\xa1\xea\x9d\x0c\x6d\x6e\x85\x2b\x66\x2d\x0d\x8c\x74\x5c\x2a\x06\x13\x87\x0c\xe1\x3d\xa0\x38\x85\x74\x4d\x5a\x00\xe8\xc6\xdf\x4f\xa2\xb1\x62\x6b\x04\x03\xd7\xc9\x43\x34\x92\x3f\x4b\xdd\x9c\xa6\x70\xfa\xad\xf9\x7b\xde\x6a\xd5\xc8\xe0\x7e\x83\xb8\x50\xdb\x9f\x99\xad\x87\x01\x3a\xce\xb7\x17\x13\xba\x3a\x2d\xf0\xf1\x8d\xb4\xfa\xff\x00\xaa\x0a\xd6\x2a\x1e\x7e\x94\x6a\x56\xbc\xe6\xcf\x19\xeb\xef\xd5\x5d\x12\x4b\x16\x23\x2a\xd5\x52\x23\x2e\x27\x38\x5c\x3e\x28\xa5\x92\x31\x27\xc3\xe2\xb1\x18\xe8\x1a\x14\x1c\x4a\x0a\xf0\xb7\x4e\xe0\x6c\xac\xf1\x37\xd8\xee\xe3\xba\x9c\x49\x87\x9b\x0e\xe3\x65\xda\x6c\xb2\x42\xf2\xed\xf7\x54\xa4\x80\xc4\xd9\x2c\x63\x27\xcf\x65\xc4\xed\x40\xf7\x35\x91\xbb\xa8\x59\x72\xbf\x15\x53\x8e\x46\xfe\xfe\xcb\x46\x32\x15\x2c\xb4\x38\x65\x5c\x8f\x97\x28\x78\xf1\xea\xa4\xa3\xda\x86\xac\xe1\x4b\xc3\xa1\x90\x08\x88\xc1\xf3\x43\x81\xd2\xfd\xc3\xe8\x9d\xf1\x39\x40\x01\x99\x80\xf9\x85\x60\x72\xec\x38\x33\xa7\x54\xd3\xf8\x79\x55\x09\x70\x76\xa5\x6f\x67\x95\xce\x93\xf5\x15\xff\xc4\x00\x2f\x11\x00\x01\x03\x02\x03\x06\x05\x03\x05\x00\x00\x00\x00\x00\x00\x00\x01\x00\x02\x03\x04\x21\x11\x13\x31\x05\x12\x22\x41\x51\x61\x71\xa1\xb1\xc1\xf0\x23\x32\xd1\x33\x81\x91\xe1\xf1\xff\xda\x00\x08\x01\x02\x01\x01\x3f\x01\xd9\x04\xef\x90\x2c\x3d\x4e\x1e\xca\xb2\x67\xc2\xc0\x19\x70\xa4\x95\xc6\x1e\x23\x74\xd9\xef\x8b\xee\x70\xbe\x9a\x76\xfc\x2a\x9a\x82\xe9\x4e\x04\x80\xb3\x09\xb3\x8e\x3e\x3e\x48\x6d\x9d\xdb\x64\xb7\xf8\x51\xc2\xd8\x2b\xfe\x96\x83\x1f\x45\x0b\xf8\xae\xab\x33\x62\x95\xed\x6d\xef\xeb\xa7\x9d\x94\x59\xd2\xcb\x8b\xec\x42\x73\x23\x67\x2f\x9c\x96\xc9\xa5\x8a\x79\x1c\x65\x18\xf0\xd9\x09\x48\x18\x0f\x45\x43\x4d\x9b\x2b\xa4\x71\xd7\x45\x2e\xfc\x2e\x31\xcc\x6c\x54\xad\x8a\x30\x66\x2d\xd1\x06\xc4\x00\x99\xfa\x15\x56\x59\x39\x73\xe0\x1c\x3e\xea\x16\xcf\x01\xce\x88\x1b\xe9\xd1\x3f\x67\x4a\xf7\x17\x11\xaa\x86\x4d\xe3\xbc\x3a\xa9\xaa\x29\x6a\x1c\x23\x79\xfd\xd5\x7d\x29\x7c\x6e\x11\x1c\x07\x44\xfa\x82\xfd\xd1\x26\x16\xeb\xa2\x64\x9c\x43\x28\x6e\xe2\xa1\x9c\xc4\xe9\x1b\x25\xc0\xbf\x6d\x7c\xb5\x42\x68\xb0\xfb\xbd\x11\x95\xad\xa7\xc8\xe6\xa9\xa9\x44\xd8\x1c\x78\x8f\x92\xa7\x7e\x55\x66\x4c\xda\x1d\x7a\x76\xf9\xe2\xa4\xa3\x8a\x46\x6e\x39\xbf\x31\x54\xf1\x06\xcd\x23\x59\x89\x23\x9f\x8f\xf7\x8e\x2a\xbd\x8d\x8f\x8d\xd6\xd2\xc8\xe4\x63\xa9\x55\x55\x70\xc8\x04\xad\x07\xba\xa6\xaa\x19\x8d\x7b\x6c\xb6\xa3\x9b\x23\x98\xe0\xdf\x9e\xfa\xaa\x08\xc1\xa7\x11\xbd\x45\x3c\x9b\x29\xfb\xae\x18\xa3\x2b\xaa\x5f\xbe\xe3\xa9\xd3\xb7\xfa\x8e\xcd\x18\xd9\x3b\x90\xef\xf9\x54\xc4\x87\x38\x8e\x40\xa9\x1e\xf7\x81\xbc\x71\xb7\xb2\xd9\xd2\xbc\xd8\xb9\x48\xf7\x1a\x9b\x9e\xbe\xaa\x8f\xf5\x23\xf1\xf7\x47\x55\xff\xc4\x00\x2f\x10\x00\x02\x01\x03\x02\x03\x07\x02\x07\x01\x00\x00\x00\x00\x00\x00\x01\x02\x03\x00\x04\x11\x12\x21\x13\x22\x31\x23\x32\x41\x51\x61\x71\x91\x33\xf0\x05\x15\x42\x52\x72\x81\xb1\xa1\xff\xda\x00\x08\x01\x01\x00\x06\x3f\x02\x4d\x71\xf2\xc8\x74\x97\x23\x97\xd0\x1f\x9a\x4b\x62\x0e\x95\x50\x4c\x63\x65\xd2\x69\xa5\xe0\x17\x94\x12\xe3\x9b\x53\x1f\x21\x4b\x24\x7a\x56\xed\x54\x1d\x12\xf4\xff\x00\x95\x1c\x57\x3c\x27\x98\x13\x92\x17\x6c\xe6\x99\x63\x0a\x90\xb0\xea\xa3\x07\x39\xde\x9d\xbf\x36\xbb\x19\x39\xc6\x05\x42\x67\x71\x3c\x93\x91\xac\x28\xdb\x3a\xaa\x07\xe1\x2c\x4c\xd9\x8f\x5f\x4e\xa3\x1b\x8a\x33\x63\xe8\xe7\x58\xf4\xf3\xf8\xa8\x73\x20\x3a\xfa\x11\xb8\xac\xb3\xa9\x45\xc9\x5e\x7d\xab\x07\x94\xe0\xb0\x22\x97\x55\xc2\x83\x8d\xc6\xa1\x56\xb6\x82\xec\xdb\x88\x70\x57\x4c\x7f\x53\x02\xb8\xd7\x40\xf6\x03\x66\x3d\xd6\xf5\xac\x22\x95\x4e\xb8\x5e\x95\xa9\x53\x97\x57\xd3\x45\xf5\xa6\x78\xad\x9c\xc5\xfb\x54\xe9\xfe\xfd\x29\xa0\x96\xe9\x4d\xc4\x6b\xd3\xc4\x7b\xd0\x4f\xdb\xb6\xf4\x62\x90\x88\xe5\x83\x1d\x5b\x1c\xc3\xd6\x83\x7e\x22\xdc\x18\x50\x03\x11\x55\xc3\xb1\xf3\x7f\xb1\x53\x76\x41\xb3\xe6\xdd\x3c\x32\x2a\x49\xa6\xb7\x6b\xce\x1a\xe1\x44\x60\x64\x93\xef\x5d\x94\x26\xd2\x72\x46\x1c\x91\x81\xbf\xd8\xa5\x62\x07\x1e\xe0\xe0\xe8\x18\xd7\x81\x9a\xe8\xc3\xd3\x02\x96\x6e\x49\x84\x8e\x18\x37\x9f\xf7\x49\xca\xca\x9a\x87\x67\xe0\x7d\xea\xde\xe4\x8d\x06\x16\xd5\x86\x3d\xdf\x03\x51\x49\x12\x34\x90\xe7\x02\x42\xa7\x07\xcf\x7a\x71\x15\xbb\x5c\x5a\xa0\x05\x94\x0c\x8c\xef\xb9\xfb\xf0\xa2\xef\x6c\xd2\x28\xe5\x17\x19\xc2\xc4\xd8\xe9\x83\xd7\x3b\x6e\x28\xf6\xac\x3d\xa8\x8b\xbb\x6e\xcc\x6e\x22\xea\x99\xf3\xa7\x9a\x2b\x45\x8d\x8a\xe5\x4a\xae\x9c\x7c\x55\xd6\x26\x26\x44\x8b\x05\x41\xca\x82\x4f\xfb\xb0\xa9\x97\xaa\x89\x0c\x40\x8d\xb4\x8f\xbc\xd4\xb1\xc2\x99\xfd\x32\x06\x3f\x18\xab\xbb\x9b\x7d\x1c\x69\x4e\xa7\x8c\xf7\x4e\xfb\xd1\xc4\x7b\x7b\x1a\x80\x1d\xc7\x1b\xa1\xfe\x55\x74\xac\x03\x29\x2a\x30\x7f\x98\xa6\x68\xa2\x48\xd8\xb9\xc9\x45\xc7\xeb\xa9\x38\x5d\x96\x48\xee\x6d\xe1\x50\xba\xa8\x57\x6d\x1a\x98\x0d\xcf\x66\xb5\x70\x06\xc3\x82\xdf\xe5\x77\xdb\xe6\xbf\xff\xc4\x00\x22\x10\x01\x00\x02\x02\x02\x03\x00\x03\x01\x01\x00\x00\x00\x00\x00\x00\x01\x11\x21\x00\x31\x41\x51\x61\x71\x81\x91\xa1\xb1\xc1\xf0\xff\xda\x00\x08\x01\x01\x00\x01\x3f\x21\x10\x32\xcf\xff\x00\x55\x6d\x07\xd7\x39\x55\x4c\x4f\x10\x53\x39\x7d\x17\x25\x21\xb4\x98\xf1\x0e\xb7\xde\x3e\x30\xd6\x2b\xcd\xeb\x1f\x75\x91\x1d\x35\x56\x4e\xce\x9c\x8a\x38\xb5\xaa\x29\xa9\xa2\xf0\x19\x37\xe0\xef\x5a\xc4\x09\x6c\x1f\x40\xf9\x13\xf7\x26\x8e\x52\xf0\x50\x51\xb9\x8b\xc0\xb0\x23\xe9\x2f\xda\xdc\x6f\x1d\x93\x08\x40\xa5\xdc\xf5\x94\xb2\x20\x4b\x48\xee\x3b\xc1\x3a\x59\x1a\x13\x5c\xfa\xe3\x1c\xd5\x99\x0a\x1c\x9a\xc2\xb0\x09\x24\xdd\x77\xee\x30\x2c\xeb\x99\x13\x50\x0e\x89\xdc\x34\x67\x1f\x94\xb8\xf6\x4e\xb2\x5e\x0d\x8c\x21\xf0\x0f\xb5\x8e\x6c\xa2\x01\x86\x9e\xd8\x24\xc4\x93\x28\xd0\xa3\x9a\x7f\x78\x4d\x28\xc6\x04\xd6\x21\xd1\x28\x94\x1c\xcf\xd1\x33\xcd\x63\x8b\x38\x94\xea\xce\x0a\x88\x2c\xde\xae\x12\x19\x8c\x3c\x38\x17\x61\xeb\x23\x79\x0d\x51\x5c\x40\xfa\xb8\x72\x01\xe3\x03\x0b\xee\x78\x79\x3c\x60\x5b\xb8\xe4\x38\xb7\xbd\x18\x20\x57\x3c\x3c\x4c\xa8\x62\xd5\xeb\x97\x00\x63\xc0\x83\xd1\xdd\xa8\x5b\xd7\xdc\x74\x8c\xc8\x4f\x0a\x9b\x89\x3f\xe7\x2b\xbc\x16\x68\x95\x23\x86\xce\x67\x22\x49\x35\xad\xc1\xf7\x5f\xe3\x2a\x6b\xe4\x21\x26\x44\xc1\xa1\x5e\x9c\xa6\x12\x75\x08\x32\xad\xfb\xe2\x54\x02\xdd\x3a\xc8\x0c\x7c\x9e\x25\xe5\x1b\x3e\x62\xb8\x63\x6a\x26\x6d\x04\x7e\x26\x74\x61\xae\x21\x26\xfb\xa2\x3b\x76\x99\xeb\x0a\xb8\x2d\x22\xad\x2e\x77\xfd\xcd\x46\x8c\xa9\x59\x47\x71\x36\x73\x18\x9b\x39\xd7\x56\x08\x63\x91\xb0\x4a\xe3\x17\x08\x72\x26\x98\xc1\x6b\xe0\x89\x88\x12\x98\x99\x5d\x87\x2e\xdc\x64\xf7\xad\x05\x6f\x6f\x36\xbf\x9c\x4b\x0e\x0c\xf6\xc4\x8f\xe8\xcf\xff\xda\x00\x0c\x03\x01\x00\x02\x00\x03\x00\x00\x00\x10\x89\x4a\x5d\xe3\xb4\xf3\x74\xe6\x50\xee\x11\x27\xec\x65\x8f\xfc\x21\x26\x5f\xff\xc4\x00\x23\x11\x01\x00\x02\x02\x02\x02\x02\x03\x01\x01\x00\x00\x00\x00\x00\x00\x01\x11\x21\x00\x31\x41\x51\x61\x71\x81\x91\xa1\xb1\xc1\xd1\xf0\xff\xda\x00\x08\x01\x03\x01\x01\x3f\x10\x69\xa6\x38\x70\x4d\x4f\x85\x62\x78\xd6\x40\x85\xbf\x37\xff\x00\x7f\x98\x74\x08\x6d\x78\x9d\xa4\xd4\x9c\x71\x3f\x78\xb9\x0e\x8e\xdb\xda\xcd\xc9\xb8\x0f\x9c\x59\x47\x22\xce\x2b\x5b\x9e\xb9\xe6\xfc\x61\x66\x9d\x91\x11\x3a\x67\xc6\xb4\x78\xf3\x8b\x25\xfb\x1c\x04\xb8\xd8\x95\x60\xbf\x47\xcd\x6b\x13\xa0\x74\x44\x1a\x0a\xaa\x46\x4b\x32\x48\x69\xc7\x11\x1e\xa7\x7b\xf9\x91\xc1\x43\x4d\xf9\x9e\xfe\x71\xf1\x4b\x70\x7f\x7a\xc4\x00\xa0\xb2\x77\x32\xfe\x0f\x8f\x38\x0c\x26\x17\x9f\x39\x11\xc2\x33\x74\x22\x12\x6d\x99\xd1\xad\xae\x2d\x92\x28\x07\x6f\x07\x6b\xf2\xd7\x46\x18\x56\x89\x6d\x9e\xa5\xb8\xfd\x7a\xc1\x79\x02\x64\xb1\x31\xc8\xc1\x1d\x46\xfe\x63\x08\x5a\x57\x05\x5d\x84\xce\xef\x67\x67\xa3\xca\x0d\xd4\x24\xcc\x5d\xfa\xe9\x86\x9c\x2b\x91\x2e\xbb\xbc\x14\x35\x5d\x9a\x01\x2a\xbd\xc3\x9f\x9a\x9c\xa6\x10\x0c\x8b\x69\xb7\xd3\x06\xb7\xba\xee\x00\x9c\xd8\xd9\xd3\x14\x03\xef\xd3\x38\xdd\x42\xb2\x93\xc1\xc1\xd4\xee\x28\xfc\x61\xee\x70\x9e\xcf\x9c\xae\x44\xa4\x98\xb8\x5d\x9c\x4c\x4e\x98\xe7\x00\xd3\x9a\xde\xbe\xb0\xa2\x44\x04\x09\x69\x0b\x36\x6e\xe6\x65\x83\x58\x26\x9e\x64\xca\xdf\x2d\x57\x8f\xb9\x6f\x24\x6c\x04\xa2\x93\x84\xfd\xf8\xd4\x60\x9a\x8c\x38\x43\x14\x49\xe0\xc7\x60\x40\x02\x25\x0b\x71\xea\x12\x64\x24\xe6\xf0\xa4\x59\x61\x51\xc5\xf7\xf6\x79\x19\xc2\x03\x58\xc2\x81\x3b\x01\x38\xe4\x88\x3d\x44\x6f\x1b\x98\xc9\x92\x92\x7a\x3b\xf4\xd1\x8c\x8a\xc0\x2b\xf1\xee\xa7\x8f\xee\x18\xa2\x0d\x31\x76\x0c\x47\xf2\x69\x36\xe4\x0e\x88\x0d\x1d\x93\x5e\xa7\x7c\xc4\x39\x04\x91\x7f\xe7\x59\xb3\xe3\xf8\x61\x29\x23\x21\xdd\xf3\x84\x1a\x1c\x0a\x3f\x18\x88\x6d\x85\x3c\x9c\x56\x4a\xe9\xa3\x77\xd6\x10\x36\xe1\xfd\x64\xbf\xe8\xe7\xff\xc4\x00\x24\x11\x01\x01\x00\x02\x02\x02\x01\x04\x03\x01\x00\x00\x00\x00\x00\x00\x01\x11\x21\x31\x00\x41\x51\x61\x71\x81\x91\xb1\xc1\xa1\xd1\xf1\xe1\xff\xda\x00\x08\x01\x02\x01\x01\x3f\x10\xd7\xa7\x57\x3d\x84\x75\x41\x50\xae\x6b\xe7\x8e\x43\x43\xe5\x3b\xff\x00\x9f\x7e\x68\xbc\x16\x48\xbe\xe6\xaf\x67\x7d\x78\xe2\x89\x90\xa0\x53\x16\x3a\x80\x1b\x59\xc2\xdd\x06\x5b\x21\x0b\xa2\x02\xa1\x8c\xef\x1d\x6f\xcb\x98\x8a\x0b\x93\x8c\x3d\x9c\xb5\xdb\x0d\xda\xc2\x20\xe0\xc7\x03\x46\x8d\x02\xdc\x88\xef\x76\xbf\x4c\x57\x9e\xd8\x3c\xf5\x44\xbe\xa7\xfb\xc0\x0b\x48\x65\xf0\xfe\x19\x6c\x4c\x75\xc1\x70\xe0\x22\x42\x6e\x47\x53\xbf\x1d\xf8\x40\x99\xb1\x95\x73\x83\xcf\xdd\xc1\x98\x0e\x39\x17\xcc\x83\xa6\xbb\x9a\x67\xee\xf8\xe0\x44\x00\xeb\xfd\x73\x0a\x4d\xa9\x17\x2b\x69\xd7\xdf\x63\x21\x78\x88\xe4\x17\x1b\x2e\x3a\xa6\x97\xb3\x13\xbe\x04\x46\x2d\xe8\xf1\x83\x67\xae\xf1\xee\xa3\xb2\x0b\x64\xcf\xbf\xae\x2f\xc7\x1a\xb3\x19\x60\xe1\x73\x82\x4d\x1d\x84\xcf\x28\x89\x91\x03\x95\x14\xf8\x83\x77\xf7\xc8\x99\xea\x57\x33\x2e\x74\x10\xf8\x38\x62\x58\xe9\xeb\x52\x75\x8a\x43\xe3\x61\xc7\xce\xa2\x40\x58\xac\x2b\xe2\xc2\x98\xa9\x9a\x50\xbb\xca\xb0\x4c\x56\x9a\x8d\x77\x93\x4c\xa7\x10\x14\x6c\xec\xf6\x91\xd4\x4e\xf3\x31\xc6\x1d\xc2\xdd\xc2\x76\xa4\xea\x77\xae\xf8\xb7\xd2\x04\xc0\xa0\xa1\xe5\xb7\x5b\xc7\x7c\x70\x7f\x3e\x60\x54\xef\x48\xb9\xcd\x7d\xe6\x9e\xf5\xc3\x46\x51\x2b\xac\x1c\x86\x72\x4d\xfd\x08\x71\x1c\xed\x00\xe5\x62\xaa\xe7\xa3\xda\xa9\x3a\xe6\x63\xa2\xc9\x66\x6b\x0f\xe9\xf7\xcb\x80\x6b\x83\x80\x98\x3a\xb1\x82\x36\x9a\x67\x14\xa4\x25\x13\x2e\x58\xe0\xd0\xd6\x2f\x56\x50\xa2\xd3\xee\x1f\xd7\x03\x71\xcc\x66\x78\x1a\xec\xcc\x62\xf5\x71\xc9\x6f\x24\x75\x07\x66\x8c\x7e\x3e\xb7\x84\x88\xc3\x7c\xa9\x02\x47\x02\xb7\xe4\x9b\x78\x02\xe1\x11\x2f\x4a\xfe\x9d\x7d\x39\x8c\x7b\xef\x60\xb1\xbd\x4e\xf1\x1b\xa3\x7c\xa8\xa9\x24\x14\xab\x37\x8c\x46\x44\x42\xa6\x6b\xcb\xd4\xce\x3c\x75\x2b\xf9\x6b\xef\xc4\x0a\x28\x1e\xcc\x3a\xf1\xc5\x67\x46\x15\x59\x72\x97\x5c\x96\xe4\xb2\x56\x4f\x1c\x39\x56\x31\x97\x19\x9f\x8c\x71\xa9\xaf\xf9\xc3\x98\x20\xe7\xff\xc4\x00\x1f\x10\x01\x01\x01\x01\x01\x01\x00\x02\x03\x01\x00\x00\x00\x00\x00\x00\x01\x11\x21\x00\x31\x41\x51\x61\x71\x81\xd1\x91\xff\xda\x00\x08\x01\x01\x00\x01\x3f\x10\xca\x95\xf8\x23\xa1\xff\x00\xa4\x51\xaa\x3a\xfa\xba\x8a\x07\x12\x09\xa8\x42\x89\x66\x0b\x78\x98\x94\xbb\x7a\x81\x41\xf3\x68\x54\xa4\x3f\x3f\x99\xc1\xac\x14\x9f\xe5\xc9\xa2\x63\xd4\x20\x1b\x60\x03\x7e\x78\x61\xc5\x9d\xc9\x6c\xce\x48\x04\x84\xb7\x5f\x9a\x7d\x70\x8f\xbd\x3f\xd3\x67\x03\x79\x27\x33\x40\x32\x80\x81\x2e\x33\xcb\xb5\xa4\xcd\x43\x4a\x92\x3e\x10\x97\xe1\xaa\xf3\x20\x83\x66\x0b\x16\x9a\x80\x3d\xec\x0c\x91\xb3\x44\xe8\x5b\x0b\x8d\x1f\x15\xe0\x07\xc3\x51\x49\x28\x68\x37\x84\xfc\xfd\x79\x70\x08\x93\xb5\x3c\x31\x4b\xf5\x4c\xf5\xe7\x5a\x4a\x54\x8a\x27\xc4\x7e\x72\x15\xef\x43\x85\x70\x3f\x25\x2a\x81\x64\x77\x7f\xa5\x88\xd3\x25\xd2\x8a\x07\x81\xcf\xe8\x65\xa6\xd2\x16\x0a\x8e\x3f\x5f\x97\x84\xd5\x81\x42\x90\x9f\x1c\xac\x10\x3c\x87\x7a\x81\xe8\x2e\x58\x00\x97\xc1\xbb\x76\xf0\x0e\xf9\x41\x10\x80\x53\x24\x8d\xf8\x8f\x36\x34\x8d\x9c\x21\x6b\x6e\x7d\xde\x42\x2f\x58\x58\x0d\x08\x88\x44\x6b\xc5\x38\x44\x28\x0a\x56\xb5\x1d\xdb\x2a\xe0\x71\x40\xe6\xd7\x40\x8d\xc4\xa0\x02\xe2\x8a\xa0\xf9\x1b\x8f\x96\x33\x41\x0a\x26\xbc\x2a\xfb\x8e\x25\x08\xf0\xbf\xb3\xed\xca\x89\x8f\x41\xa8\x18\xda\x07\xd8\x1a\x88\xe6\x60\x11\x2f\xd3\x5b\x9f\xbd\xe6\x98\x60\x8c\xc5\x3e\x18\x03\x63\x3d\x87\x04\x50\x82\x8a\xc5\x70\x53\x01\x29\x9e\x1d\xec\xd3\x64\x68\xc0\x80\x91\x5f\xc0\xe0\x04\xab\x86\x18\x84\x04\x92\xfa\x1a\x8f\xa4\xe9\xbb\x42\xa6\xa8\xfe\xd0\x1a\x15\x21\x73\x6e\xd0\x53\x3c\x60\x00\x28\x86\x5a\xf3\x95\xfb\x8c\x82\xf8\x33\xce\x7e\xee\x61\xdf\x91\x84\x0f\x45\xf4\xbe\x5e\x97\xcc\x8b\x06\xca\xc1\x34\xa5\x65\xe9\x16\xd6\x05\xda\x00\xc4\x11\x49\x27\x0c\x3a\xaa\x84\x8a\x5a\x11\x70\x81\xf5\x84\xe5\x4c\x1d\x0d\x86\x1e\x12\x8b\x82\x3e\x1c\xe9\xe7\x22\x03\x5b\x0e\x59\x08\x31\x4e\x73\x89\x22\x5d\x2d\x66\xdf\xc7\x01\x35\x22\x85\x04\x7d\x13\x27\xe3\x88\x8b\x69\x72\x89\x62\x7e\xb8\xcf\x34\xdf\x40\x00\xa0\x28\x5f\x05\x38\x49\x00\x4b\xf4\xa5\xc5\xd5\x7f\x95\x7a\x26\x52\x46\x28\x4b\x69\x1b\xf5\x3f\x79\xdc\x04\x5a\x04\x8e\x7e\xb9\xad\x75\x05\x5f\xf6\xef\xff\xd9",
        expectedMatch: /Render_Image\('Raw'\)/,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, false, false]
            }
        ],
    },
    {
        name: "Magic: mojibake",
        input: "d091d18bd100d182d180d0b0d10020d0bad0bed180d0b8d187d0bdd0b5d0b2d0b0d10020d0bbd0b8d100d0b020d0bfd180d18bd0b3d0b0d0b5d18220d187d0b5d180d0b5d0b720d0bbd0b5d0bdd0b8d0b2d183d18e20d100d0bed0b1d0b0d0bad1832e",
        expectedMatch: /Быртрар коричневар лира прыгает через ленивую робаку./,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, true, false]
            }
        ],
    },
    {
        name: "Magic Chain of Base64",
        input: "WkVkV2VtUkRRbnBrU0Vwd1ltMWpQUT09",
        expectedMatch: /From_Base64\('A-Za-z0-9\+\/=',true\)\nFrom_Base64\('A-Za-z0-9\+\/=',true\)\nFrom_Base64\('A-Za-z0-9\+\/=',true\)/,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, true, false]
            }
        ],
    },
    {
        name: "Magic Chain of Hex to Hexdump to Base64",
        input: "MDAwMDAwMDAgIDM3IDM0IDIwIDM2IDM1IDIwIDM3IDMzIDIwIDM3IDM0IDIwIDMyIDMwIDIwIDM3ICB8NzQgNjUgNzMgNzQgMjAgN3wKMDAwMDAwMTAgIDMzIDIwIDM3IDM0IDIwIDM3IDMyIDIwIDM2IDM5IDIwIDM2IDY1IDIwIDM2IDM3ICB8MyA3NCA3MiA2OSA2ZSA2N3w=",
        expectedMatch: /From_Base64\('A-Za-z0-9\+\/=',true\)\nFrom_Hexdump\(\)\nFrom_Hex\('Space'\)/,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, true, false]
            }
        ],
    },
    {
        name: "Magic Chain of Charcode to Octal to Base32",
        input: "GY3SANRUEA2DAIBWGYQDMNJAGQYCANRXEA3DGIBUGAQDMNZAGY2CANBQEA3DEIBWGAQDIMBAGY3SANRTEA2DAIBWG4QDMNBAGQYCANRXEA3DEIBUGAQDMNRAG4YSANBQEA3DMIBRGQ2SANBQEA3DMIBWG4======",
        expectedMatch: /From_Base32\('A-Z2-7=',false\)\nFrom_Octal\('Space'\)\nFrom_Hex\('Space'\)/,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, true, false]
            }
        ],
    },
    {
        name: "Magic Chain of Base64 Output Check",
        input: "WkVkV2VtUkRRbnBrU0Vwd1ltMWpQUT09",
        expectedMatch: /test string/,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, true, false]
            }
        ],
    },
    {
        name: "Magic Chain of Decimal to Base32 to Base32",
        input: "I5CVSVCNJFBFER2BLFJUCTKKKJDVKUKEINGUUV2FIFNFIRKJIJJEORJSKNAU2SSSI5MVCRCDJVFFKRKBLFKECTSKIFDUKWKUIFEUEUSHIFNFCPJ5HU6Q====",
        expectedMatch: /test string/,
        recipeConfig: [
            {
                op: "Magic",
                args: [3, true, false]
            }
        ],
    },
]);
