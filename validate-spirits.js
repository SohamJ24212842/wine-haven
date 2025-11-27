const fs = require('fs');

const spirits = JSON.parse(fs.readFileSync('spirits-list.json', 'utf8'));
const issues = [];

console.log(`Validating ${spirits.length} spirits...\n`);

spirits.forEach((p, i) => {
  // Required fields
  if (!p.name) issues.push({ product: i, name: 'Unknown', issue: 'Missing name' });
  if (!p.category) issues.push({ product: i, name: p.name || 'Unknown', issue: 'Missing category' });
  if (p.price === undefined || p.price === null) issues.push({ product: i, name: p.name || 'Unknown', issue: 'Missing price' });
  if (typeof p.price === 'string') issues.push({ product: i, name: p.name || 'Unknown', issue: 'Price is string, should be number' });
  if (!p.country) issues.push({ product: i, name: p.name || 'Unknown', issue: 'Missing country' });
  
  // Optional but should be correct type
  if (p.slug) issues.push({ product: i, name: p.name || 'Unknown', issue: 'Has slug field (will be auto-generated, can be removed)' });
  if (p.featured !== undefined && typeof p.featured !== 'boolean') issues.push({ product: i, name: p.name || 'Unknown', issue: `featured should be boolean, got ${typeof p.featured}` });
  if (p.new !== undefined && typeof p.new !== 'boolean') issues.push({ product: i, name: p.name || 'Unknown', issue: `new should be boolean, got ${typeof p.new}` });
  if (p.onSale !== undefined && typeof p.onSale !== 'boolean') issues.push({ product: i, name: p.name || 'Unknown', issue: `onSale should be boolean, got ${typeof p.onSale}` });
  if (p.christmasGift !== undefined && typeof p.christmasGift !== 'boolean') issues.push({ product: i, name: p.name || 'Unknown', issue: `christmasGift should be boolean, got ${typeof p.christmasGift}` });
  if (p.images && !Array.isArray(p.images)) issues.push({ product: i, name: p.name || 'Unknown', issue: 'images should be array' });
  
  // Check for zero prices (might be intentional but worth flagging)
  if (p.price === 0) issues.push({ product: i, name: p.name || 'Unknown', issue: 'Price is 0 (might be placeholder)' });
});

if (issues.length === 0) {
  console.log('✅ All products are valid!');
  console.log(`Total products: ${spirits.length}`);
  console.log('\n✅ Ready for bulk import!');
} else {
  console.log(`❌ Found ${issues.length} issues:\n`);
  issues.slice(0, 30).forEach(issue => {
    console.log(`  [Product ${issue.product}] ${issue.name}: ${issue.issue}`);
  });
  if (issues.length > 30) {
    console.log(`  ... and ${issues.length - 30} more issues`);
  }
  
  // Group by issue type
  const grouped = {};
  issues.forEach(issue => {
    if (!grouped[issue.issue]) grouped[issue.issue] = [];
    grouped[issue.issue].push(issue.name);
  });
  
  console.log('\n📊 Issues by type:');
  Object.entries(grouped).forEach(([issue, names]) => {
    console.log(`  ${issue}: ${names.length} products`);
  });
}





