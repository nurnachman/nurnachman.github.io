---
title: "iPhone : How To Deselect a Row in a UITableView"
date: "2012-06-20"
---

Clicking a row in a UITableView keeps it 'selected' as a toggle.  
I wanted to remove this selection after the user clicks the row.  
  
Here's the code:  
  

```
 - (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{     [tableView deselectRowAtIndexPath:indexPath animated:YES];}
```
